"use client";
import { X, MessageCircle } from "lucide-react";
import { AlertType } from "@/types";
import { useState } from "react";

export default function PhoneNumberManager({
  platform,
  phoneNumbers,
  onAdd,
  onRemove,
}: {
  platform: AlertType;
  phoneNumbers: string[];
  onAdd: (platform: AlertType, phoneNumber: string) => void;
  onRemove: (platform: AlertType, index: number) => void;
}) {
  const [newNumber, setNewNumber] = useState("");

  const handleAdd = () => {
    if (newNumber.trim()) {
      onAdd(platform, newNumber);
      setNewNumber("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Add Phone Number
        </label>
        <div className="flex gap-2">
          <input
            type="tel"
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
            placeholder="+1234567890"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <button
            onClick={handleAdd}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </div>
      </div>

      {phoneNumbers.length > 0 && (
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
            Configured Numbers ({phoneNumbers.length})
          </label>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {phoneNumbers.map((number, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              >
                <span className="font-mono text-gray-900 dark:text-white">
                  {number}
                </span>
                <button
                  onClick={() => onRemove(platform, index)}
                  className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {phoneNumbers.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <MessageCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No phone numbers configured</p>
          <p className="text-sm">Add numbers above to receive alerts</p>
        </div>
      )}
    </div>
  );
}
