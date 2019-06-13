package com.sky.manager.service;

import org.springframework.util.concurrent.ListenableFuture;
public interface TestService {

    void testAsync();

    ListenableFuture<String> testAsyncResult();
}
