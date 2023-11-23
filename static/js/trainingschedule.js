function openPopup() {
    document.getElementById('classPopup').style.display = 'block';
}

function closePopup() {
    document.getElementById('classPopup').style.display = 'none';
}

function saveClass() {
    var selectedTime = document.getElementById('time').value;
    var selectedDay = document.getElementById('day').value;
    var selectedClass = document.getElementById('trainingClass').value;

    // Find the appropriate cell in the table based on selected time and day
    var timeIndex = getTimeIndex(selectedTime);
    var dayIndex = getDayIndex(selectedDay);

    // Update the table with the selected class
    if (timeIndex !== -1 && dayIndex !== -1) {
        var cellId = dayIndex + " " + timeIndex;
        document.getElementById(cellId).innerHTML = selectedClass;
    }

    // Close the popup
    closePopup();
}

function getTimeIndex(selectedTime) {
    var times = [
        "9:00 AM - 10:30 AM",
        "11:00 AM - 12:30 PM",
        "1:00 PM - 2:30 PM",
        "3:00 PM - 4:30 PM",
        "5:00 PM - 6:30 PM"
    ];
    return times.indexOf(selectedTime);
}

function getDayIndex(selectedDay) {
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.indexOf(selectedDay);
}