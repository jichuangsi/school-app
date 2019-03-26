package com.jichuangsi.school.student;

import android.app.Dialog;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.graphics.drawable.ColorDrawable;
import android.os.Bundle;
import android.support.v4.app.DialogFragment;
import android.view.View;
import android.view.Window;
import android.view.WindowManager;
import android.widget.ImageView;
import android.widget.TextView;

import com.jichuangsi.school.student.Constants.Constants;
import com.jichuangsi.school.student.data.DatabaseHelper;
import com.jichuangsi.school.student.data.models.BlobContentHolder;

public class CustomDialogFragment extends DialogFragment {
    private DatabaseHelper mDbHelper = null;

    private Context context = null;

    public void setContext(Context context){
        this.context = context;
    }

    @Override
    public Dialog onCreateDialog(Bundle savedInstanceState) {
        mDbHelper = new DatabaseHelper(context) ;

        Dialog dialog = new Dialog(getActivity());
        dialog.getWindow().getAttributes().windowAnimations = R.style.Animation_CustomDialog;
        dialog.getWindow().requestFeature(Window.FEATURE_NO_TITLE);
        dialog.getWindow().setFlags(WindowManager.LayoutParams.FLAG_FULLSCREEN, WindowManager.LayoutParams.FLAG_LAYOUT_IN_SCREEN);
        dialog.setContentView(R.layout.dialog_custom);
        dialog.getWindow().setBackgroundDrawable(new ColorDrawable(Color.TRANSPARENT));
        dialog.setCanceledOnTouchOutside(false);
        /*TextView message = (TextView) dialog.findViewById(R.id.message);
        message.setText(text.getText());*/
        ImageView myImageView = (ImageView) dialog.findViewById(R.id.image_view);
        byte[] qc = mDbHelper.getB(new BlobContentHolder(Constants.BLOB_NAME1));
        if(qc!=null){
            Bitmap bitmap = BitmapFactory.decodeByteArray(qc, 0, qc.length);
            myImageView.setImageBitmap(bitmap);
            //drawView.setBackground(new BitmapDrawable(DrawActivity.this.getResources(), bitmap));
        }
        //myImageView.setImageURL("https://pic.cnblogs.com/avatar/1142647/20170416093225.png");
        dialog.findViewById(R.id.positive_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
        dialog.findViewById(R.id.close_button).setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                dismiss();
            }
        });
        return dialog;
    }
}
