package com.ricardo.backend;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.Date;

public class TokenTimestamp {
    private static final Logger logger = LoggerFactory.getLogger(TokenTimestamp.class);

    public static void main(String[] args) {
        long iat = 1734893902L;
        long exp = 1734980302L;

        Date iatDate = new Date(iat * 1000);
        Date expDate = new Date(exp * 1000);

        System.out.println("El token fue creado (iat): " + iatDate);
        System.out.println("El token expira (exp): " + expDate);
    }
}

