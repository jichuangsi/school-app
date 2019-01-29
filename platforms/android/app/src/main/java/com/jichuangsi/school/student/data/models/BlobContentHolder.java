package com.jichuangsi.school.student.data.models;

public class BlobContentHolder {

    private long id;
    private String name;
    private byte[] content;

    public BlobContentHolder(){}

    public BlobContentHolder(String name){
        this.name = name;
    }

    public BlobContentHolder(String name, byte[] content){
        this.name = name;
        this.content = content;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
