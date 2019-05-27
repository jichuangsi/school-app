package com.jichuangsi.school.student;

import android.bluetooth.BluetoothDevice;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.PixelFormat;
import android.graphics.drawable.BitmapDrawable;
import android.os.Bundle;
import android.os.Handler;
import android.os.Message;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;
import android.support.v7.app.AppCompatActivity;
import android.util.Log;
import android.view.GestureDetector;
import android.view.Gravity;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.WindowManager;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.Toast;

import com.example.tangdao.gcharms1.freedrawview.FreeDrawView;
import com.example.tangdao.gcharms1.freedrawview.PathRedoUndoCountChangeListener;
import com.jichuangsi.school.student.Constants.Constants;
import com.jichuangsi.school.student.data.models.BlobContentHolder;
import com.jichuangsi.school.student.data.DatabaseHelper;
import com.royole.drawinglib.Constant;
import com.royole.drawinglib.RyDrawingManager;
import com.royole.drawinglib.data.PointData;
import com.royole.drawinglib.interfaces.IDrawingDataListener;

import java.io.ByteArrayOutputStream;
import java.util.ArrayList;
import java.util.List;


public class DrawActivity extends AppCompatActivity implements View.OnClickListener {

    private static final String TAG = "DrawActivity";

    //取消按钮
    private Button btnMainCancel;
    //撤销
    private ImageView ivMainUndo;
    //反撤销
    private ImageView ivMainRedo;
    //橡皮擦
    private ImageView ivMainClear;
    //清除
    private ImageView ivMainClearAll;
    //确认
    private Button ivMainRight;
    //红色色块
    private ImageView ivColorRed;
    //黑色色块
    private ImageView ivColorBalck;
    //题目详情
    private ImageView ivQuestionContent;

    private FreeDrawView drawView;
    private RyDrawingManager mRyDrawingManager;
    private static final float DEFAULT_PAINT_STROKE = 1;
    private static final float DEFAULT_ERASER_STROKE = 20;
    private ArrayList<BluetoothDevice> mDevDataList = new ArrayList<>(8);
    //当前蓝牙连接状态
    private int mCurrentConnectedState;
    public static byte[] points;
    private MyDataListener mDataListener;
    /**
     * 这是手写板宽
     */
    private static final float DEFAULTWIDTH = 9035F;
    /**
     * 这是手写板高
     */
    private static final float DEFAULTHEIGHT = 12649F;
    Handler timerHandler = new Handler() {
        @Override
        public void handleMessage(Message msg) {
            drawView.setDataComming(false);
        }
    };
    /**
     * base64格式图片
     */
    private String mBase64;

    /**
     * 只有2中颜色切换，就这样吧
     * 画笔颜色，0：黑色  1：红色 -1:橡皮擦
     */
    private int paintColor = 0;
    private int mDrawViewWidth;
    private int mDrawViewHeight;
    private boolean eraser;

    private DatabaseHelper mDbHelper = null;

    @Override
    protected void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        Log.i("TAG", "DrawActivity");
        getWindow().addFlags(WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON);
        setContentView(R.layout.activity_draw);

        findViews();
        String img = getIntent().getStringExtra("baseimg");
        connectBle();
        mDbHelper = new DatabaseHelper(DrawActivity.this) ;

        //这里监听手写板坐标变化
        mDataListener = new MyDataListener();
        mRyDrawingManager.setDrawingDataListener(mDataListener);
        if (points != null) {
            List<PointData.Point> pointList = mRyDrawingManager.parseRawDataToPointList(points);
            if (pointList != null) {
                for (PointData.Point point : pointList) {
                    mDataListener.onDrawingDataChange(point.x, point.y, point.pressure, point.time);
                }
            }
        }

        byte[] ac = mDbHelper.getB(new BlobContentHolder(Constants.BLOB_NAME));
        if(ac!=null){
            Bitmap bitmap = BitmapFactory.decodeByteArray(ac, 0, ac.length);
            drawView.setBackground(new BitmapDrawable(DrawActivity.this.getResources(), bitmap));
        }
        /*if (!TextUtils.isEmpty(img)) {
            try {
                String base64 = ImageUtil.encodeBase64File(img);
                Log.i("TAG", "base64" + base64.length());
                drawView.setBackground(new BitmapDrawable(ImageUtil.base64ToBitmap(base64)));
            } catch (Exception e) {
                e.printStackTrace();
            }
            Log.d(TAG, "图片");
        } else {
            Log.d(TAG, "空图片");
        }*/
    }

    /**
     * 每次进入画板，检查下蓝牙连接吧
     */
    @Override
    protected void onRestart() {
        super.onRestart();
        connectBle();
    }

    /**
     * 这里获取手机画板view的宽高
     */
    @Override
    protected void onResume() {
        super.onResume();
        drawView.post(new Runnable() {
            @Override
            public void run() {
                mDrawViewWidth = drawView.getWidth();
                mDrawViewHeight = drawView.getHeight();
            }
        });
    }

    private void connectBle() {
        if (null == mRyDrawingManager) {
            try {
                mRyDrawingManager = handwritten.board.HandwrittenBoard.getRyDrawingManager();
            } catch (Exception e) {
                mRyDrawingManager = RyDrawingManager.getInstance();
                mRyDrawingManager.init(this);
                e.printStackTrace();
            }
        }
        mCurrentConnectedState = mRyDrawingManager.getRyConnectionState();
        if (mCurrentConnectedState == Constant.ServiceConnectionState.STATE_CONNECTED) {
            Toast.makeText(DrawActivity.this, "蓝牙已连接", Toast.LENGTH_SHORT).show();
        } else {
            Toast.makeText(DrawActivity.this, "蓝牙未连接", Toast.LENGTH_SHORT).show();
        }
    }

    @Override
    public void onClick(View v) {
        if (v == btnMainCancel) {
            mDbHelper.deleteB(new BlobContentHolder(Constants.BLOB_NAME));
            mDbHelper.deleteB(new BlobContentHolder(Constants.BLOB_NAME1));
            finish();
        } else if (v == ivMainUndo) {
            drawView.undoLast();
        } else if (v == ivMainRedo) {
            drawView.redoLast();
        } else if (v == ivMainClear) {
            selectEraser();
        } else if (v == ivMainClearAll) {
            drawView.clearDraw();
        } else if (v == ivMainRight) {
            /*if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
                if (ActivityCompat.checkSelfPermission(DrawActivity.this, Manifest.permission
                        .WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
                    ActivityCompat.requestPermissions(DrawActivity.this, new String[]{Manifest.permission
                            .WRITE_EXTERNAL_STORAGE}, 100);
                }else {
                    drawView.getDrawScreenshot(new MyDrawScreenshot());
                }
            }else {
                drawView.getDrawScreenshot(new MyDrawScreenshot());
            }*/
            drawView.getDrawScreenshot(new MyDrawScreenshot());
        } else if (v == ivColorBalck) {
            setPaintColor(0);
        } else if (v == ivColorRed) {
            setPaintColor(1);
        } else if (v == ivQuestionContent) {
            /*CustomDialogFragment dialog = new CustomDialogFragment();
            dialog.setContext(DrawActivity.this);
            dialog.show(getSupportFragmentManager(), "dialog");*/
            if(mView==null) creatFloatingImageview();
        }
    }

    /**
     * 设置橡皮擦
     */
    private void selectEraser() {
        drawView.setPaintColor(getResources().getColor(R.color.white));
        drawView.setPaintWidthDp(DEFAULT_ERASER_STROKE);
        drawView.setMode(FreeDrawView.Mode.ERASER);
        eraser = true;
        paintColor = -1;
        ivColorBalck.setImageResource(R.drawable.default_black_pan);
        ivColorRed.setImageResource(R.drawable.default_red_pan);
    }

    /**
     * 这里设置画笔颜色
     */
    private void setPaintColor(int color) {
        if (paintColor != color) {
            switch (color) {
                case 1:
                    paintColor = 1;
                    ivColorRed.setImageResource(R.drawable.select_red_pan);
                    ivColorBalck.setImageResource(R.drawable.default_black_pan);
                    drawView.setPaintColor(getResources().getColor(R.color.paintRedColor));
                    break;
                case 0:
                default:
                    paintColor = 0;
                    ivColorRed.setImageResource(R.drawable.default_red_pan);
                    ivColorBalck.setImageResource(R.drawable.select_black_pan);
                    drawView.setPaintColor(getResources().getColor(R.color.paintBlackColor));
                    break;
            }

            if (drawView.getPaintWidth(true) != DEFAULT_PAINT_STROKE) {
                drawView.setPaintWidthDp(DEFAULT_PAINT_STROKE);
            }
            drawView.setMode(FreeDrawView.Mode.PEN);
            eraser = false;
        }
    }

    private void findViews() {
        btnMainCancel = findViewById(R.id.btn_main_cancel);
        btnMainCancel.setOnClickListener(this);

        ivMainUndo = findViewById(R.id.iv_main_undo);
        ivMainUndo.setOnClickListener(this);

        ivMainRedo = findViewById(R.id.iv_main_redo);
        ivMainRedo.setOnClickListener(this);

        ivMainClear = findViewById(R.id.iv_main_clear);
        ivMainClear.setOnClickListener(this);

        ivMainClearAll = findViewById(R.id.iv_main_clear_all);
        ivMainClearAll.setOnClickListener(this);

        ivMainRight = findViewById(R.id.iv_main_right);
        ivMainRight.setOnClickListener(this);

        drawView = findViewById(R.id.drawing_view);
        drawView.setPathRedoUndoCountChangeListener(new MyPathRedoUndoCountChangeListener());

        ivColorBalck = findViewById(R.id.iv_color_black);
        ivColorBalck.setOnClickListener(this);

        ivColorRed = findViewById(R.id.iv_color_red);
        ivColorRed.setOnClickListener(this);

        ivQuestionContent = findViewById(R.id.iv_question_content);
        ivQuestionContent.setOnClickListener(this);
    }

    @Override
    protected void onDestroy() {
        super.onDestroy();
        mRyDrawingManager.setDrawingDataListener(null);
        drawView.release();
        points = null;
        mDbHelper.release();
        mDbHelper = null ;
    }

    /**
     * 手写板坐标回调监听
     */
    private class MyDataListener implements IDrawingDataListener {
        @Override
        public void onDrawingDataChange(int x, int y, int p, long time) {
            if (p == 0) {
                return;
            }
            if (!eraser) {
                //注意啊：手写板分辨率跟平板不一样，需要根据比例缩放手写板传过来的point坐标。
                drawView.drawPoints((int) (mDrawViewWidth / DEFAULTWIDTH * x), (int) (mDrawViewHeight / DEFAULTHEIGHT
                        * y));
                drawView.setDataComming(true);
                timerHandler.removeMessages(10000);
                timerHandler.sendEmptyMessageDelayed(10000, 50);
            }
        }
    }

    /**
     * 创建图片的监听，在这里可以拿到绘画完的图片
     */
    private class MyDrawScreenshot implements FreeDrawView.DrawCreatorListener {
        @Override
        public void onDrawCreated(final Bitmap draw) {
            //mBase64 = ImageUtil.saveBitmap(DrawActivity.this,draw);

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream(draw.getByteCount());
            draw.compress(Bitmap.CompressFormat.PNG, 100, outputStream);
            BlobContentHolder blobContentHolder = new BlobContentHolder(Constants.BLOB_NAME, outputStream.toByteArray());
            mDbHelper.updateB(blobContentHolder);

            setResult(RESULT_OK, new Intent().putExtra("img", mBase64));
            finish();
        }

        @Override
        public void onDrawCreationError() {

        }
    }

    @Override
    public void onRequestPermissionsResult(int requestCode, @NonNull String[] permissions, @NonNull int[]
            grantResults) {
        super.onRequestPermissionsResult(requestCode, permissions, grantResults);
        if (requestCode == 100) {
            if (grantResults.length != 0 && grantResults[0] == PackageManager.PERMISSION_GRANTED) {
                drawView.getDrawScreenshot(new MyDrawScreenshot());
            } else {
                Toast.makeText(DrawActivity.this, "请打存储权限", Toast.LENGTH_SHORT).show();
            }
        }
    }

    private class MyPathRedoUndoCountChangeListener implements PathRedoUndoCountChangeListener {
        @Override
        public void onUndoCountChanged(int undoCount) {
            if (undoCount > 0) {
                ivMainUndo.setClickable(true);
                ivMainUndo.setImageResource(R.drawable.undo_canclick);
            } else {
                ivMainUndo.setClickable(false);
                ivMainUndo.setImageResource(R.drawable.undo_default);
            }
        }

        @Override
        public void onRedoCountChanged(int redoCount) {
            if (redoCount > 0) {
                ivMainRedo.setClickable(true);
                ivMainRedo.setImageResource(R.drawable.redo_canclick);
            } else {
                ivMainRedo.setClickable(false);
                ivMainRedo.setImageResource(R.drawable.redo_default);
            }
        }
    }

    /////////////////////创建悬浮窗口/////////////////////////////////////

    private GestureDetector mGestureDetector;
    private boolean isMove;//判断悬浮窗是否移动
    private View mView;
    private WindowManager mWM;

    private class MyViewTouchListener implements View.OnTouchListener {
        //开始触控的坐标，移动时的坐标（相对于屏幕左上角的坐标）
        private int mTouchStartX,mTouchStartY,mTouchCurrentX,mTouchCurrentY;
        //开始时的坐标和结束时的坐标（相对于自身控件的坐标）
        private int mStartX,mStartY,mStopX,mStopY;

        private WindowManager.LayoutParams params;
        private WindowManager mWM;
        private View mView;

        public MyViewTouchListener(WindowManager mWM, WindowManager.LayoutParams params, View mView){
            this.mWM = mWM;
            this.params = params;
            this.mView = mView;
        }

        @Override
        public boolean onTouch(View v, MotionEvent event) {
            switch (event.getAction()) {
                case MotionEvent.ACTION_DOWN:    //捕获手指触摸按下动作
                    isMove = false;
                    mTouchStartX = (int)event.getRawX();
                    mTouchStartY = (int)event.getRawY();
                    mStartX = (int)event.getX();
                    mStartY = (int)event.getY();
                    break;
                case MotionEvent.ACTION_MOVE:   //捕获手指触摸移动动作
                    mTouchCurrentX = (int) event.getRawX();
                    mTouchCurrentY = (int) event.getRawY();
                    params.x += mTouchCurrentX - mTouchStartX;
                    params.y += mTouchCurrentY - mTouchStartY;
                    mWM.updateViewLayout(mView, params);
                    mTouchStartX = mTouchCurrentX;
                    mTouchStartY = mTouchCurrentY;
                    break;
                case MotionEvent.ACTION_UP:    //捕获手指触摸离开动作
                    mStopX = (int)event.getX();
                    mStopY = (int)event.getY();
                    if(Math.abs(mStartX - mStopX) >= 1 || Math.abs(mStartY - mStopY) >= 1){
                        //Toast.makeText(getApplicationContext(), "你点击了悬浮窗", Toast.LENGTH_SHORT).show();
                        isMove = true;
                    }
                    break;
            }
            return mGestureDetector.onTouchEvent(event);
        }
    }

    private void creatFloatingImageview(){
        WindowManager.LayoutParams params;
        //WindowManager mWM;
        params = new WindowManager.LayoutParams();
        params.height = WindowManager.LayoutParams.WRAP_CONTENT;
        params.width = WindowManager.LayoutParams.WRAP_CONTENT;
        params.format = PixelFormat.TRANSLUCENT;
        params.windowAnimations = R.style.Animation_CustomDialog;
        // 悬浮窗类型，整个demo的关键点
        params.type = WindowManager.LayoutParams.TYPE_TOAST;
        params.gravity = Gravity.CENTER_HORIZONTAL | Gravity.CENTER_VERTICAL;
        params.x = 0;
        params.y = 0;
        params.setTitle(getResources().getString(R.string.title));
        params.flags = WindowManager.LayoutParams.FLAG_NOT_TOUCH_MODAL
                | WindowManager.LayoutParams.FLAG_NOT_FOCUSABLE | WindowManager.LayoutParams.FLAG_LAYOUT_NO_LIMITS;
        mWM = getWindowManager();
        LayoutInflater inflate = (LayoutInflater)getSystemService(Context.LAYOUT_INFLATER_SERVICE);
        mView = inflate.inflate(R.layout.activity_floating_imageview, null);

        ImageView myImageView = mView.findViewById(R.id.float_image_view);
        byte[] qc = mDbHelper.getB(new BlobContentHolder(Constants.BLOB_NAME1));
        if(qc!=null){
            Bitmap bitmap = BitmapFactory.decodeByteArray(qc, 0, qc.length);
            myImageView.setImageBitmap(bitmap);
        }
        mView.setOnTouchListener(new MyViewTouchListener(mWM, params, mView));
        mGestureDetector = new GestureDetector(this, new MyOnGestureListener());

        mWM.addView(mView, params);
    }

    class MyOnGestureListener extends GestureDetector.SimpleOnGestureListener {
        @Override
        public boolean onSingleTapConfirmed(MotionEvent e) {
            if (!isMove) {
                //Toast.makeText(getApplicationContext(), "你点击了悬浮窗", Toast.LENGTH_SHORT).show();
                mWM.removeViewImmediate(mView);
                mView = null;
            }
            return super.onSingleTapConfirmed(e);
        }
    }

    /////////////////////创建悬浮窗口/////////////////////////////////////
}
