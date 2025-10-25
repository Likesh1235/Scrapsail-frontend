package com.scrapsail.service;

import com.scrapsail.model.PickupRequest;
import com.scrapsail.repository.PickupRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PickupService {
    
    @Autowired
    private PickupRepository pickupRepository;
    
    public PickupRequest createPickup(PickupRequest request) {
        // Set default values
        request.setStatus("PENDING");
        request.setCreatedAt(java.time.LocalDateTime.now());
        
        return pickupRepository.save(request);
    }
    
    public PickupRequest updateStatus(Long pickupId, String status, String notes) {
        PickupRequest pickup = pickupRepository.findById(pickupId)
                .orElseThrow(() -> new RuntimeException("Pickup request not found"));
        
        pickup.setStatus(status);
        
        if (notes != null && !notes.trim().isEmpty()) {
            if ("APPROVED".equals(status) || "REJECTED".equals(status)) {
                pickup.setAdminNotes(notes);
            } else if ("COMPLETED".equals(status)) {
                pickup.setCollectorNotes(notes);
            }
        }
        
        return pickupRepository.save(pickup);
    }
    
    public List<PickupRequest> getAllPickups() {
        return pickupRepository.findAll();
    }
    
    public List<PickupRequest> getPickupsByStatus(String status) {
        return pickupRepository.findByStatus(status);
    }
    
    public List<PickupRequest> getPickupsByEmail(String email) {
        return pickupRepository.findByEmail(email);
    }
    
    public Optional<PickupRequest> getPickupById(Long id) {
        return pickupRepository.findById(id);
    }
    
    public long getPickupCountByStatus(String status) {
        return pickupRepository.countByStatus(status);
    }
}

