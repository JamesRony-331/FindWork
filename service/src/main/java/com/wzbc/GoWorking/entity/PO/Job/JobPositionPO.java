package com.wzbc.GoWorking.entity.PO.Job;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 招聘岗位明细。
 */
@Data
public class JobPositionPO {
    private Long id;
    private String source;
    private String sourceJobId;
    private String sourceUrl;
    private String jobName;
    private String standardJob;
    private String jobCategory;
    private String companyName;
    private String province;
    private String city;
    private String district;
    private String region;
    private String cityLevel;
    private String salaryText;
    private BigDecimal salaryMin;
    private BigDecimal salaryMax;
    private BigDecimal salaryAvg;
    private Integer salaryMonths;
    private String salaryUnit;
    private Integer salaryNegotiable;
    private String educationText;
    private String education;
    private String experience;
    private String majorText;
    private String description;
    private LocalDateTime publishTime;
    private LocalDateTime collectTime;
    private LocalDateTime updateTime;
    private Integer jobStatus;
    private Integer isDelete;
}
