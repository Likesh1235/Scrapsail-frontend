package com.scrapsail.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.scrapsail.model.PickupRequest;
import com.scrapsail.repository.PickupRepository;
import com.scrapsail.controller.OtpController;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pickup")
@CrossOrigin(origins = "*")
public class PickupController {

    @Autowired
    private PickupRepository pickupRepository;

    @PostMapping("/request")
    public Map<String, Object> createPickup(@RequestBody PickupRequest request) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            // Check if email is OTP verified
            if (!OtpController.isVerified(request.getEmail())) {
                response.put("success", false);
                response.put("message", "Please verify your email with OTP before submitting pickup request!");
                return response;
            }

            // Validate required fields
            if (request.getName() == null || request.getName().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Name is required!");
                return response;
            }
            
            if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Email is required!");
                return response;
            }
            
            if (request.getPhone() == null || request.getPhone().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Phone number is required!");
                return response;
            }
            
            if (request.getScrapType() == null || request.getScrapType().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Scrap type is required!");
                return response;
            }
            
            if (request.getPickupDate() == null || request.getPickupDate().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Pickup date is required!");
                return response;
            }
            
            if (request.getAddress() == null || request.getAddress().trim().isEmpty()) {
                response.put("success", false);
                response.put("message", "Address is required!");
                return response;
            }

            // Save pickup request
            PickupRequest savedRequest = pickupRepository.save(request);
            
            // Clear OTP verification after successful submission
            OtpController.otpVerified.remove(request.getEmail());
            
            response.put("success", true);
            response.put("message", "Pickup request submitted successfully!");
            response.put("pickupId", savedRequest.getId());
            response.put("data", savedRequest);
            
            return response;
            
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to submit pickup request: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/requests")
    public Map<String, Object> getAllPickupRequests() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PickupRequest> requests = pickupRepository.findAll();
            response.put("success", true);
            response.put("data", requests);
            response.put("count", requests.size());
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch pickup requests: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/requests/{id}")
    public Map<String, Object> getPickupRequest(@PathVariable Long id) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            PickupRequest request = pickupRepository.findById(id).orElse(null);
            if (request != null) {
                response.put("success", true);
                response.put("data", request);
            } else {
                response.put("success", false);
                response.put("message", "Pickup request not found!");
            }
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch pickup request: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/requests/email/{email}")
    public Map<String, Object> getPickupRequestsByEmail(@PathVariable String email) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            List<PickupRequest> requests = pickupRepository.findByEmail(email);
            response.put("success", true);
            response.put("data", requests);
            response.put("count", requests.size());
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch pickup requests: " + e.getMessage());
            return response;
        }
    }

    @PutMapping("/requests/{id}/status")
    public Map<String, Object> updatePickupStatus(@PathVariable Long id, @RequestParam String status, @RequestParam(required = false) String notes) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            PickupRequest request = pickupRepository.findById(id).orElse(null);
            if (request != null) {
                request.setStatus(status);
                if (notes != null && !notes.trim().isEmpty()) {
                    if ("ADMIN".equals(status) || "REJECTED".equals(status)) {
                        request.setAdminNotes(notes);
                    } else if ("COMPLETED".equals(status)) {
                        request.setCollectorNotes(notes);
                    }
                }
                
                pickupRepository.save(request);
                response.put("success", true);
                response.put("message", "Pickup status updated successfully!");
                response.put("data", request);
            } else {
                response.put("success", false);
                response.put("message", "Pickup request not found!");
            }
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to update pickup status: " + e.getMessage());
            return response;
        }
    }

    @GetMapping("/stats")
    public Map<String, Object> getPickupStats() {
        Map<String, Object> response = new HashMap<>();
        
        try {
            long totalRequests = pickupRepository.count();
            long pendingRequests = pickupRepository.countByStatus("PENDING");
            long approvedRequests = pickupRepository.countByStatus("APPROVED");
            long completedRequests = pickupRepository.countByStatus("COMPLETED");
            
            Map<String, Long> stats = new HashMap<>();
            stats.put("total", totalRequests);
            stats.put("pending", pendingRequests);
            stats.put("approved", approvedRequests);
            stats.put("completed", completedRequests);
            
            response.put("success", true);
            response.put("data", stats);
            return response;
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Failed to fetch pickup stats: " + e.getMessage());
            return response;
        }
    }
}