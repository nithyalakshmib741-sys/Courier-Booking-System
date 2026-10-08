package com.example.courierbooking;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = "*")
public class CourierBookingController {

    private final CourierBookingRepository repository;

    public CourierBookingController(CourierBookingRepository repository) {
        this.repository = repository;
    }

    // ------------------------------------------------------------
    // GET ALL BOOKINGS
    // ------------------------------------------------------------
    @GetMapping
    public List<CourierBooking> getAllBookings() {
        return repository.findAll();
    }

    // ------------------------------------------------------------
    // CREATE BOOKING
    // ------------------------------------------------------------
    @PostMapping
    public CourierBooking createBooking(@RequestBody CourierBooking booking) {

        // Generate tracking number automatically
        if (booking.getTrackingNumber() == null ||
                booking.getTrackingNumber().isBlank()) {

            booking.setTrackingNumber(
                    "CB" + System.currentTimeMillis()
            );
        }

        // Set default status
        if (booking.getStatus() == null ||
                booking.getStatus().isBlank()) {

            booking.setStatus("Pending");
        }

        return repository.save(booking);
    }

    // ------------------------------------------------------------
    // GET BOOKING BY ID
    // ------------------------------------------------------------
    @GetMapping("/{id}")
    public CourierBooking getBookingById(@PathVariable Long id) {
        return repository.findById(id).orElse(null);
    }

    // ------------------------------------------------------------
    // DELETE BOOKING
    // ------------------------------------------------------------
    @DeleteMapping("/{id}")
    public void deleteBooking(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
