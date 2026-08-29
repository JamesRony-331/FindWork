package com.wzbc.GoWorking;

import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@MapperScan("com.wzbc.GoWorking.Mapper")
@SpringBootApplication
public class GoWorkingApplication {

	public static void main(String[] args) {
		SpringApplication.run(GoWorkingApplication.class, args);
	}

}
