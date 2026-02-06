"use client";
import { X, MessageCircle } from "lucide-react";
import { AlertType } from "@/types";
import { useState } from "react";

export type AlertContact = { name: string; phoneNumber: string };

export default function PhoneNumberManager({
  platform,
  phoneNumbers,
  onAdd,
  onRemove,
}: {
  platform: AlertType;
  phoneNumbers: AlertContact[];
  onAdd: (platform: AlertType, contact: AlertContact) => void;
  onRemove: (platform: AlertType, index: number) => void;
}) {
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");

  const handleAdd = () => {
    if (newName.trim() && newNumber.trim()) {
      onAdd(platform, { name: newName.trim(), phoneNumber: newNumber.trim() });
      setNewName("");
      setNewNumber("");
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
          Add Contact
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="Contact name"
            className="flex-1 px-3 py-2 bg-gray-50 dark:bg-slate-700 border border-gray-300 dark:border-slate-600 text-gray-900 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
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
          <div className="max-h-48 overflow-y-auto rounded-lg border border-gray-200 dark:border-slate-600">
            <table className="w-full">
              <thead className="sticky top-0">
                <tr className="bg-gray-100 dark:bg-slate-700">
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2.5">
                    #
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2.5">
                    Name
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2.5">
                    Phone Number
                  </th>
                  <th className="text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 py-2.5">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-600">
                {phoneNumbers.map((contact, index) => (
                  <tr
                    key={index}
                    className="hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors"
                  >
                    <td className="px-4 py-2.5 text-sm text-gray-500 dark:text-gray-400">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2.5 text-sm text-gray-900 dark:text-white">
                      {contact.name}
                    </td>
                    <td className="px-4 py-2.5 font-mono text-sm text-gray-900 dark:text-white">
                      {contact.phoneNumber}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => onRemove(platform, index)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
