package com.example.tangdao.gcharms1;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.util.Base64;
import android.util.Log;

import net.bither.util.NativeUtil;

import java.io.ByteArrayInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;

/**
 * @author hmy
 * @date 2019/1/28
 */
public class ImageUtil {

    public static String encodeBase64File(String path) throws Exception {
        File file = new File(path);
        FileInputStream inputFile = new FileInputStream(file);
        byte[] buffer = new byte[(int) file.length()];
        inputFile.read(buffer);
        inputFile.close();
        return Base64.encodeToString(buffer, Base64.DEFAULT);
    }


    public static Bitmap base64ToBitmap(String base64Data) {
        byte[] bytes = Base64.decode(base64Data, Base64.DEFAULT);
        return BitmapFactory.decodeByteArray(bytes, 0, bytes.length);
    }

    public static String saveBitmap(Context context,Bitmap bitmap) {
        File f = new File(context.getExternalCacheDir(), "compress.png");
        if (f.exists()) {
            f.delete();
        }
        try {
            FileOutputStream out = new FileOutputStream(f);
            bitmap.compress(Bitmap.CompressFormat.PNG, 100, out);
            out.flush();
            out.close();
        } catch (IOException e) {
            e.printStackTrace();
        }
        //如果图片大于500K,压缩
        if(f.length()>512000) {
            Log.e("===compressImage===", "====开始==压缩==saveFile==" + f.getAbsolutePath());
            NativeUtil.compressBitmap(bitmap, f.getAbsolutePath());
            Log.e("===compressImage===", "====完成==压缩==saveFile==" + f.length());
        }
        return f.getAbsolutePath();
    }


    public static String encodeBase64String(Context context,String base64) throws Exception {
        File saveFile = new File(context.getExternalCacheDir(), "compress.png");
        if (saveFile.exists()) {
            saveFile.delete();
        }
        byte[] bytes = Base64.decode(base64, Base64.DEFAULT);
        ByteArrayInputStream in = new ByteArrayInputStream(bytes);
        byte[] buffer = new byte[1024];
        FileOutputStream out = new FileOutputStream(saveFile);
        int len = 0;
        while ((len = in.read(buffer)) != -1) {
            out.write(buffer, 0, len);
        }
        out.close();

        if(saveFile.length()>512000) {
            NativeUtil.compressBitmap(base64ToBitmap(base64), saveFile.getAbsolutePath());
        }

        return saveFile.getAbsolutePath();
    }
}
