import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  onTimeChange: (newTime: string) => void; // Callback to pass time back to parent
  addedHours: Number
}

const TimePicker: React.FC<TimePickerProps> = ({ onTimeChange, addedHours = 0 }) => {
  const [time, setTime] = useState<string>("");

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow the user to input numbers and h/m characters
    const validInputPattern = /^[0-9hHmM\s]*$/;

    if (validInputPattern.test(value)) {
      // Update time state
      setTime(value);

      // Send the raw input value to the parent
      onTimeChange(value);
    }
  };

  // Function to parse and format the time for display
  const formatTimeValue = (input: string) => {
    // Remove spaces and lowercase the input
    const normalizedInput = input.replace(/\s+/g, "").toLowerCase();

    // Extract hours and minutes
    const hoursMatch = normalizedInput.match(/(\d+)h/);
    const minutesMatch = normalizedInput.match(/(\d+)m/);

    let hours = hoursMatch ? parseInt(hoursMatch[1]) : 0;
    let minutes = minutesMatch ? parseInt(minutesMatch[1]) : 0;

    // Format the time to show hours and minutes
    let formattedTime = "";
    if (hours > 0) formattedTime += `${hours}h `;
    if (minutes > 0) formattedTime += `${minutes}m`;

    return formattedTime.trim();
  };

  return (
    <div className="flex flex-col space-y-2">
      <Input
        placeholder={`${addedHours}`}
        value={time} // Show raw input so the user can type freely
        onChange={handleInputChange} // Handle user input
        onBlur={() => setTime(formatTimeValue(time))} // Format time on blur
        className="border-0 focus:border placeholder:text-grey-100 text-center"
      />
    </div>
  );
};

export default TimePicker;
