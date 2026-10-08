// ============================================================
// COURIER BOOKING SYSTEM - FRONTEND SCRIPT
// Backend: http://localhost:8080
// API:     http://localhost:8080/api/bookings
// ============================================================

const API_URL = "http://localhost:8080/api/bookings";


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function getElement(...ids) {
    for (const id of ids) {
        const element = document.getElementById(id);

        if (element) {
            return element;
        }
    }

    return null;
}


function getValue(...ids) {
    const element = getElement(...ids);

    return element
        ? element.value.trim()
        : "";
}


function setValue(value, ...ids) {
    const element = getElement(...ids);

    if (element) {
        element.value = value ?? "";
    }
}


function setText(text, ...ids) {
    const element = getElement(...ids);

    if (element) {
        element.textContent = text ?? "";
    }
}


function showMessage(message, type = "success") {

    const messageElement = getElement(
        "message",
        "successMessage",
        "formMessage",
        "bookingMessage"
    );

    if (!messageElement) {
        console.log(message);
        return;
    }

    messageElement.textContent = message;
    messageElement.style.display = "block";

    if (type === "error") {
        messageElement.style.color = "red";
    } else {
        messageElement.style.color = "green";
    }
}


function clearMessage() {

    const messageElement = getElement(
        "message",
        "successMessage",
        "formMessage",
        "bookingMessage"
    );

    if (messageElement) {
        messageElement.textContent = "";
        messageElement.style.display = "none";
    }
}


// ============================================================
// CLEAR VALIDATION ERRORS
// ============================================================

function clearErrors() {

    const errorIds = [
        "phoneError",
        "dateError",
        "pickupError",
        "deliveryError",
        "parcelError",
        "weightError",
        "deliveryTypeError",
        "senderError",
        "receiverError"
    ];

    errorIds.forEach(id => {
        setText("", id);
    });


    const errorElements = document.querySelectorAll(
        ".error, .error-message, .field-error"
    );

    errorElements.forEach(element => {
        element.textContent = "";
    });
}


// ============================================================
// VALIDATION
// ============================================================

function validateBooking() {

    clearErrors();

    let valid = true;


    const phone = getValue(
        "phone",
        "phoneNumber",
        "mobile"
    );


    const bookingDate = getValue(
        "bookingDate",
        "date",
        "deliveryDate"
    );


    const pickupAddress = getValue(
        "pickupAddress",
        "pickup",
        "pickupLocation"
    );


    const deliveryAddress = getValue(
        "deliveryAddress",
        "delivery",
        "deliveryLocation"
    );


    const parcelType = getValue(
        "parcelType",
        "parcel",
        "packageType"
    );


    const weight = getValue(
        "weight",
        "parcelWeight",
        "packageWeight"
    );


    const deliveryType = getValue(
        "deliveryType",
        "serviceType"
    );


    const senderName = getValue(
        "senderName",
        "sender"
    );


    const receiverName = getValue(
        "receiverName",
        "receiver"
    );


    // --------------------------------------------------------
    // PHONE
    // --------------------------------------------------------

    if (phone && !/^[0-9]{10}$/.test(phone)) {

        setText(
            "Enter a valid 10-digit phone number.",
            "phoneError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // DATE
    // --------------------------------------------------------

    if (!bookingDate) {

        setText(
            "Please select a booking date.",
            "dateError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // PICKUP
    // --------------------------------------------------------

    if (!pickupAddress) {

        setText(
            "Please enter the pickup address.",
            "pickupError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // DELIVERY
    // --------------------------------------------------------

    if (!deliveryAddress) {

        setText(
            "Please enter the delivery address.",
            "deliveryError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // PARCEL
    // --------------------------------------------------------

    if (!parcelType) {

        setText(
            "Please select a parcel type.",
            "parcelError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // WEIGHT
    // --------------------------------------------------------

    if (!weight) {

        setText(
            "Please enter parcel weight.",
            "weightError"
        );

        valid = false;

    } else if (
        isNaN(Number(weight)) ||
        Number(weight) <= 0
    ) {

        setText(
            "Weight must be greater than 0.",
            "weightError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // DELIVERY TYPE
    // --------------------------------------------------------

    if (!deliveryType) {

        setText(
            "Please select a delivery type.",
            "deliveryTypeError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // SENDER
    // --------------------------------------------------------

    if (
        getElement("senderName", "sender") &&
        !senderName
    ) {

        setText(
            "Please enter the sender name.",
            "senderError"
        );

        valid = false;
    }


    // --------------------------------------------------------
    // RECEIVER
    // --------------------------------------------------------

    if (
        getElement("receiverName", "receiver") &&
        !receiverName
    ) {

        setText(
            "Please enter the receiver name.",
            "receiverError"
        );

        valid = false;
    }


    return valid;
}


// ============================================================
// CREATE BOOKING
// ============================================================

async function createBooking(event) {

    if (event) {
        event.preventDefault();
    }


    clearMessage();


    if (!validateBooking()) {
        return;
    }


    // --------------------------------------------------------
    // GET FORM VALUES
    // --------------------------------------------------------

    const senderName = getValue(
        "senderName",
        "sender"
    );


    const receiverName = getValue(
        "receiverName",
        "receiver"
    );


    const phone = getValue(
        "phone",
        "phoneNumber",
        "mobile"
    );


    const bookingDate = getValue(
        "bookingDate",
        "date",
        "deliveryDate"
    );


    const pickupAddress = getValue(
        "pickupAddress",
        "pickup",
        "pickupLocation"
    );


    const deliveryAddress = getValue(
        "deliveryAddress",
        "delivery",
        "deliveryLocation"
    );


    const parcelType = getValue(
        "parcelType",
        "parcel",
        "packageType"
    );


    const weight = getValue(
        "weight",
        "parcelWeight",
        "packageWeight"
    );


    const deliveryType = getValue(
        "deliveryType",
        "serviceType"
    );


    // --------------------------------------------------------
    // BOOKING OBJECT
    // --------------------------------------------------------

    const booking = {

        senderName: senderName,

        receiverName: receiverName,

        phone: phone,

        bookingDate: bookingDate,

        pickupAddress: pickupAddress,

        deliveryAddress: deliveryAddress,

        parcelType: parcelType,

        weight: Number(weight),

        deliveryType: deliveryType
    };


    console.log(
        "Sending booking to backend:",
        booking
    );


    // --------------------------------------------------------
    // SEND TO SPRING BOOT
    // --------------------------------------------------------

    try {

        const response = await fetch(
            API_URL,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(booking)
            }
        );


        const responseText =
            await response.text();


        let data = null;


        if (responseText) {

            try {

                data = JSON.parse(responseText);

            } catch (error) {

                data = responseText;
            }
        }


        // ----------------------------------------------------
        // ERROR
        // ----------------------------------------------------

        if (!response.ok) {

            console.error(
                "Backend error:",
                response.status,
                data
            );


            showMessage(
                "Booking failed. Server returned HTTP " +
                response.status +
                ".",
                "error"
            );

            return;
        }


        // ----------------------------------------------------
        // SUCCESS
        // ----------------------------------------------------

        console.log(
            "Booking created:",
            data
        );


        const trackingNumber =
            data &&
            data.trackingNumber
                ? data.trackingNumber
                : null;


        if (trackingNumber) {

            showMessage(
                "Booking created successfully! Tracking Number: " +
                trackingNumber,
                "success"
            );

        } else {

            showMessage(
                "Booking created successfully!",
                "success"
            );
        }


        // Clear form
        clearBookingForm();


        // Reload table
        await loadBookings();

    } catch (error) {

        console.error(
            "Could not connect to backend:",
            error
        );


        showMessage(
            "Cannot connect to the Spring Boot server. " +
            "Make sure the backend is running on port 8080.",
            "error"
        );
    }
}


// ============================================================
// FIND BOOKINGS TABLE BODY
// ============================================================
//
// This is the important fix.
//
// Instead of depending on a particular <tbody> ID,
// we search for the table containing "Tracking No."
// and then use its <tbody>.
// ============================================================

function findBookingsTableBody() {

    // First try common IDs
    const bodyById = getElement(
        "bookingTableBody",
        "bookingsTableBody",
        "bookingList",
        "bookingsList"
    );


    if (bodyById) {
        return bodyById;
    }


    // Otherwise inspect all tables
    const tables = document.querySelectorAll("table");


    for (const table of tables) {

        const text =
            table.innerText.toLowerCase();


        if (
            text.includes("tracking") &&
            (
                text.includes("sender") ||
                text.includes("receiver")
            )
        ) {

            const tbody =
                table.querySelector("tbody");


            if (tbody) {
                return tbody;
            }
        }
    }


    // Last fallback: first tbody on the page
    return document.querySelector("table tbody");
}


// ============================================================
// GET ALL BOOKINGS
// ============================================================

async function loadBookings() {

    console.log(
        "Loading bookings from:",
        API_URL
    );


    try {

        const response =
            await fetch(API_URL);


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );
        }


        const bookings =
            await response.json();


        console.log(
            "Bookings received from backend:",
            bookings
        );


        displayBookings(bookings);


    } catch (error) {

        console.error(
            "Error loading bookings:",
            error
        );


        // Show useful message in console.
        // The page itself doesn't need an error popup.
    }
}


// ============================================================
// DISPLAY BOOKINGS
// ============================================================

function displayBookings(bookings) {

    const tableBody =
        findBookingsTableBody();


    // --------------------------------------------------------
    // IMPORTANT DEBUG MESSAGE
    // --------------------------------------------------------

    if (!tableBody) {

        console.error(
            "Could not find the bookings table <tbody>."
        );

        return;
    }


    // Clear existing rows
    tableBody.innerHTML = "";


    // --------------------------------------------------------
    // NO BOOKINGS
    // --------------------------------------------------------

    if (
        !bookings ||
        !Array.isArray(bookings) ||
        bookings.length === 0
    ) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td colspan="8"
                style="text-align:center;">
                No bookings yet.
            </td>
        `;


        tableBody.appendChild(row);


        return;
    }


    // --------------------------------------------------------
    // DISPLAY EACH BOOKING
    // --------------------------------------------------------

    bookings.forEach(booking => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                ${escapeHtml(
                    booking.trackingNumber ?? "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    booking.senderName ?? "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    booking.receiverName ?? "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    booking.parcelType ?? "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    booking.weight ?? "-"
                )}
            </td>

            <td>
                ${escapeHtml(
                    booking.deliveryType ?? "-"
                )}
            </td>

            <td>
                <span class="booking-status">
                    ${escapeHtml(
                        booking.status ?? "-"
                    )}
                </span>
            </td>

            <td>
                <button
                    type="button"
                    class="delete-booking-btn"
                    onclick="deleteBooking(${booking.id})">
                    Delete
                </button>
            </td>

        `;


        tableBody.appendChild(row);
    });


    console.log(
        "Bookings successfully displayed:",
        bookings.length
    );
}


// ============================================================
// DELETE BOOKING
// ============================================================

async function deleteBooking(id) {

    if (!id) {
        return;
    }


    const confirmed =
        confirm(
            "Are you sure you want to delete this booking?"
        );


    if (!confirmed) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/${encodeURIComponent(id)}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "HTTP " + response.status
            );
        }


        showMessage(
            "Booking deleted successfully.",
            "success"
        );


        await loadBookings();


    } catch (error) {

        console.error(
            "Delete error:",
            error
        );


        showMessage(
            "Could not delete the booking.",
            "error"
        );
    }
}


// ============================================================
// CLEAR BOOKING FORM
// ============================================================

function clearBookingForm() {

    const form =
        document.querySelector("form");


    if (form) {
        form.reset();
    }


    setValue(
        "",
        "senderName",
        "sender"
    );


    setValue(
        "",
        "receiverName",
        "receiver"
    );


    setValue(
        "",
        "phone",
        "phoneNumber",
        "mobile"
    );


    setValue(
        "",
        "bookingDate",
        "date",
        "deliveryDate"
    );


    setValue(
        "",
        "pickupAddress",
        "pickup",
        "pickupLocation"
    );


    setValue(
        "",
        "deliveryAddress",
        "delivery",
        "deliveryLocation"
    );


    setValue(
        "",
        "parcelType",
        "parcel",
        "packageType"
    );


    setValue(
        "",
        "weight",
        "parcelWeight",
        "packageWeight"
    );


    setValue(
        "",
        "deliveryType",
        "serviceType"
    );


    clearErrors();
}


// ============================================================
// HTML ESCAPING
// ============================================================

function escapeHtml(value) {

    if (
        value === null ||
        value === undefined
    ) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ============================================================
// PAGE INITIALIZATION
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        console.log(
            "===================================="
        );

        console.log(
            "Courier Booking System loaded."
        );

        console.log(
            "Backend API:",
            API_URL
        );

        console.log(
            "===================================="
        );


        // ----------------------------------------------------
        // FORM
        // ----------------------------------------------------

        const form =
            document.querySelector("form");


        if (form) {

            // Only use the form submit event.
            // This prevents duplicate POST requests.
            form.addEventListener(
                "submit",
                createBooking
            );
        }


        // ----------------------------------------------------
        // NON-SUBMIT BOOKING BUTTONS
        // ----------------------------------------------------

        const submitButtons =
            document.querySelectorAll(
                "#submitBooking, " +
                "#bookNow, " +
                "#bookingButton, " +
                ".book-now, " +
                ".submit-booking"
            );


        submitButtons.forEach(button => {

            // If button is a submit button inside a form,
            // the form's submit event handles it.
            if (
                form &&
                form.contains(button) &&
                (
                    button.type === "submit" ||
                    button.type === ""
                )
            ) {
                return;
            }


            button.addEventListener(
                "click",
                createBooking
            );
        });


        // ----------------------------------------------------
        // CLEAR BUTTONS
        // ----------------------------------------------------

        const clearButtons =
            document.querySelectorAll(
                "#clearButton, " +
                "#resetButton, " +
                "#clearForm, " +
                ".clear-form"
            );


        clearButtons.forEach(button => {

            button.addEventListener(
                "click",
                function (event) {

                    if (event) {
                        event.preventDefault();
                    }

                    clearBookingForm();
                }
            );
        });


        // ----------------------------------------------------
        // LOAD BOOKINGS
        // ----------------------------------------------------

        loadBookings();
    }
);


// ============================================================
// MAKE FUNCTIONS AVAILABLE TO HTML
// ============================================================

window.createBooking =
    createBooking;

window.loadBookings =
    loadBookings;

window.deleteBooking =
    deleteBooking;

window.clearBookingForm =
    clearBookingForm;

window.clearErrors =
    clearErrors;