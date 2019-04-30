package com.sky.manager.bean;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.io.Serializable;
import java.util.Date;

/**
 * assest_statistics
 * @author 
 */
public class AssestStatistics implements Serializable {
    /**
     * 主键ID
     */
    private String id;

    /**
     * 创建时间
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date createTime;

    /**
     * 支付宝
     */
    private Double zfb;

    /**
     * 微信
     */
    private Double wx;

    /**
     * 银行卡
     */
    private Double yhk;

    /**
     * 当月总额
     */
    private Double total;

    /**
     * 修改时间
     */
    @JsonFormat(pattern="yyyy-MM-dd")
    private Date updateTime;

    private static final long serialVersionUID = 1L;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public Date getCreateTime() {
        return createTime;
    }

    public void setCreateTime(Date createTime) {
        this.createTime = createTime;
    }

    public Double getZfb() {
        return zfb;
    }

    public void setZfb(Double zfb) {
        this.zfb = zfb;
    }

    public Double getWx() {
        return wx;
    }

    public void setWx(Double wx) {
        this.wx = wx;
    }

    public Double getYhk() {
        return yhk;
    }

    public void setYhk(Double yhk) {
        this.yhk = yhk;
    }

    public Double getTotal() {
        return total;
    }

    public void setTotal(Double total) {
        this.total = total;
    }

    public Date getUpdateTime() {
        return updateTime;
    }

    public void setUpdateTime(Date updateTime) {
        this.updateTime = updateTime;
    }

    @Override
    public String toString() {
        StringBuilder sb = new StringBuilder();
        sb.append(getClass().getSimpleName());
        sb.append(" [");
        sb.append("Hash = ").append(hashCode());
        sb.append(", id=").append(id);
        sb.append(", createTime=").append(createTime);
        sb.append(", zfb=").append(zfb);
        sb.append(", wx=").append(wx);
        sb.append(", yhk=").append(yhk);
        sb.append(", total=").append(total);
        sb.append(", updateTime=").append(updateTime);
        sb.append(", serialVersionUID=").append(serialVersionUID);
        sb.append("]");
        return sb.toString();
    }
}