package com.jichuangsi.school.student.data;

import java.util.List;

import android.content.ContentValues;
import android.content.Context;
import android.database.Cursor;
import android.database.sqlite.SQLiteDatabase;
import android.database.sqlite.SQLiteOpenHelper;
import android.util.Log;

import com.jichuangsi.school.student.data.models.BlobContentHolder;

public class DatabaseHelper extends SQLiteOpenHelper {

    private static final String TAG = "JCS.DatabaseHelper:";

    private static final String DATABASE_NAME = "jichuangsi.student.db" ;

    private static final String TABLE_BLOB = "PIC";

    private static final String CREATE_SQL = "CREATE TABLE "
            + TABLE_BLOB
            + "("
            + "id" + " INTEGER PRIMARY KEY AUTOINCREMENT,"
            + "name" + " VARCHAR(64), "
            + "content" + " BLOB "
            + ");" ;


    public DatabaseHelper(Context context) {
        super(context, DATABASE_NAME, null, 1) ;

    }

    @Override
    public void onCreate(SQLiteDatabase db) {
        db.execSQL(CREATE_SQL);
    }

    @Override
    public void onUpgrade(SQLiteDatabase db, int oldVersion, int newVersion) {
        db.execSQL("DROP TABLE IF EXISTS " + DATABASE_NAME + ";");
        db.execSQL(CREATE_SQL);
    }

    public void release() {
        super.close() ;
    }

    private void insertB(BlobContentHolder b, SQLiteDatabase db) {

        ContentValues values = new ContentValues();
        values.put("name", b.getName());
        values.put("content", b.getContent());

        long id = db.insert(TABLE_BLOB, null, values);

        Log.d(TAG, "插入图片的id：" + id);

    }

    public void insertBlobContent(List<BlobContentHolder> list) {
        SQLiteDatabase db  = getWritableDatabase() ;
        db.beginTransaction();
        for(BlobContentHolder o : list){
            String col[] = {"id"};
            String whereClause = "name=?";
            String[] whereArgs = {o.getName()} ;
            Cursor cursor = db.query(TABLE_BLOB, col, whereClause, whereArgs, null, null, null);
            if (cursor == null || cursor.getCount() == 0) {
                insertB(o, db) ;
            }else{
                ContentValues values = new ContentValues();
                values.put("name", o.getName());
                values.put("content", o.getContent());
                String whereClause1 = "name=?" ;
                String[] whereArgs1 = {o.getName()} ;
                int result = db.update(TABLE_BLOB, values, whereClause, whereArgs);
            }
        }
        db.setTransactionSuccessful();
        db.endTransaction();
        db.close();

    }

	public  void updateB(BlobContentHolder b) {

		ContentValues values = new ContentValues();
        values.put("name", b.getName());
        values.put("content", b.getContent());

		String whereClause = "name=?" ;
		String[] whereArgs = {b.getName()} ;
		SQLiteDatabase db  = getWritableDatabase() ;
		int result = db.update(TABLE_BLOB, values, whereClause, whereArgs);
		db.close();

        Log.d(TAG, "更新图片的结果：" + result);
	}


	public  void deleteB(BlobContentHolder b) {

		String whereClause = "name=? " ;
		String[] whereArgs = {b.getName()} ;
		SQLiteDatabase db  = getWritableDatabase() ;
		int result = db.delete(TABLE_BLOB, whereClause, whereArgs);
		db.close();

        Log.d(TAG, "删除图片的结果：" + result);
	}

    public byte[] getB(BlobContentHolder b) {
        Cursor cursor;
        byte[] content = null;

        String col[] = {"id", "name" ,"content"};
        String whereClause = "name=?";
        String[] whereArgs = {b.getName()} ;
        SQLiteDatabase db  = getWritableDatabase() ;
        cursor = db.query(TABLE_BLOB, col, whereClause, whereArgs, null, null, null);
        Log.d(TAG, "获取图片的结果：" + cursor==null?"null":cursor.getCount()+"");
        if (cursor == null || cursor.getCount() == 0) {
            db.close();
            return null ;
        }
        cursor.moveToFirst();
        content = cursor.getBlob(2);
        cursor.close();
        db.close();
        return content;
    }

    public  void clearAll() {

		String whereClause = null ;
		String[] whereArgs = null ;
		SQLiteDatabase db  = getWritableDatabase() ;
		db.delete(TABLE_BLOB, whereClause, whereArgs);
		db.close();
	}

	/*private App cursorToApp(Cursor cursor) {
		App app = new App() ;
		app.setId(cursor.getInt(cursor.getColumnIndex(AppColumns.ID)));
		app.setCategory(cursor.getInt(cursor.getColumnIndex(AppColumns.CATEGORY)));
		app.setGroupId(cursor.getInt(cursor.getColumnIndex(AppColumns.GROUPID)));
		app.setParentId(cursor.getInt(cursor.getColumnIndex(AppColumns.PARENTID)));
		app.setScreen(cursor.getInt(cursor.getColumnIndex(AppColumns.SCREEN)));
		app.setName(cursor.getString(cursor.getColumnIndex(AppColumns.NAME)));
		app.setIcon(cursor.getString(cursor.getColumnIndex(AppColumns.ICON)));
		app.setPkg(cursor.getString(cursor.getColumnIndex(AppColumns.PKG)));
		app.setCls(cursor.getString(cursor.getColumnIndex(AppColumns.CLS)));
		app.setData(cursor.getString(cursor.getColumnIndex(AppColumns.DATA)));
		app.setContentType(cursor.getString(cursor.getColumnIndex(AppColumns.CONTENT_TYPE)));

		return app ;
	}

	public  List<App> getAppList(int category) {
		List<App> appList = new ArrayList<App>() ;
		String[] columns = null ;
		String selection = AppColumns.CATEGORY + "=?" ;
		String[] selectionArgs = {String.valueOf(category)} ;
		if (category == -1) {
			selection = null ;
			selectionArgs = null  ;
		}
		String groupBy = null ;
		String having = null ;
		String orderBy = null ;
		SQLiteDatabase db  = getReadableDatabase() ;
		Cursor cursor = db.query(App.TABLE_APP, columns, selection, selectionArgs, groupBy, having, orderBy);
		if (cursor == null) {
			db.close();
			return appList ;
		}

		while (cursor.moveToNext()) {
			appList.add(cursorToApp(cursor));
		}
		cursor.close();
		db.close();
		return appList ;
	}*/

}
