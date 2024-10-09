import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface TimePickerProps {
  onTimeChange: (newTime: string) => void; // Callback to pass time back to parent
  addedHours: number; // Change type to `number` (not `Number`)
}

const TimePicker: React.FC<TimePickerProps> = ({
  onTimeChange,
  addedHours = 0,
}) => {
  const [time, setTime] = useState<string>("");

  // Function to handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow the user to input numbers and h/m characters, or a decimal
    const validInputPattern = /^[0-9hHmM\s.]*$/;

    if (validInputPattern.test(value)) {
      // Update time state
      setTime(value);

      // Convert decimal input to hours and minutes if applicable
      const formattedTime = convertDecimalToTime(value);
      onTimeChange(formattedTime); // Send formatted value to parent
    }
  };

  // Function to handle key presses
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      // Format time when Enter is pressed
      setTime(convertDecimalToTime(time));
    }
  };

  // Function to convert decimal input to hours and minutes
  const convertDecimalToTime = (input: string) => {
    // Remove spaces and lowercase the input
    const normalizedInput = input.replace(/\s+/g, "").toLowerCase();

    // Match decimal input
    const decimalMatch = normalizedInput.match(/^(\d+)(\.(\d{1,2}))?$/);

    if (decimalMatch) {
      const hours = parseInt(decimalMatch[1]); // Hours before the decimal
      const minutesDecimal = decimalMatch[3] || "00"; // Get digits after the decimal, default to "00"

      // Handle minutes based on the decimal format
      const tensMinutes = parseInt(minutesDecimal[0] || "0"); // First digit as tens minutes
      const singleMinutes = parseInt(minutesDecimal[1] || "0"); // Second digit as single minutes

      const totalMinutes = tensMinutes * 10 + singleMinutes; // Total minutes calculation
      return `${hours}h ${totalMinutes}m`.trim();
    }

    // If the input doesn't match decimal format, process as regular input
    return formatTimeValue(normalizedInput);
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
        onBlur={() => setTime(convertDecimalToTime(time))} // Format time on blur
        onKeyDown={handleKeyPress} // Handle key presses
        className="border-0 focus:border placeholder:text-grey-100 text-center"
      />
    </div>
  );
};

export default TimePicker;
