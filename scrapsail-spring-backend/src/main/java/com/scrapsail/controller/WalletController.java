package com.scrapsail.controller;

import com.scrapsail.entity.CarbonWallet;
import com.scrapsail.repository.WalletRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.*;

@RestController
@RequestMapping("/api/wallet")
@CrossOrigin(origins = "http://localhost:5173")
public class WalletController {
    
    @Autowired
    private WalletRepository walletRepository;
    
    @GetMapping("/{userId}")
    public ResponseEntity<?> getWallet(@PathVariable Long userId) {
        try {
            Optional<CarbonWallet> walletOpt = walletRepository.findByUserId(userId);
            
            if (walletOpt.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("wallet", walletOpt.get());
                return ResponseEntity.ok(response);
            } else {
                // Create a new wallet if it doesn't exist
                CarbonWallet newWallet = new CarbonWallet();
                newWallet.setTotalCredits(0);
                newWallet.setCashBalance(0);
                
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("wallet", newWallet);
                response.put("message", "New wallet created");
                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to fetch wallet: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
    
    @PostMapping("/create/{userId}")
    public ResponseEntity<?> createWallet(@PathVariable Long userId) {
        try {
            Optional<CarbonWallet> existingWallet = walletRepository.findByUserId(userId);
            
            if (existingWallet.isPresent()) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "Wallet already exists for this user");
                return ResponseEntity.badRequest().body(response);
            }
            
            CarbonWallet wallet = new CarbonWallet();
            wallet.setTotalCredits(0);
            wallet.setCashBalance(0);
            
            CarbonWallet savedWallet = walletRepository.save(wallet);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Wallet created successfully");
            response.put("wallet", savedWallet);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "Failed to create wallet: " + e.getMessage());
            return ResponseEntity.badRequest().body(response);
        }
    }
}

