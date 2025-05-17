import React, { useState, useEffect, useRef } from "react";
import "./MultiSelect.scss";
import {
  ChevronDownIcon,
  ChevronUpIcon,
  CheckIcon,
} from "@heroicons/react/20/solid";
interface Item {
  id: string;
  label: string;
}

interface MultiSelectProps {
  initialItems?: Item[];
  placeholder?: string;
}

const STORAGE_KEY = "multi-select-items";

export const MultiSelect: React.FC<MultiSelectProps> = ({
  initialItems = [],
  placeholder = "",
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setItems(JSON.parse(stored));
    } else {
      setItems(initialItems);
    }
  }, [initialItems]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      const exists = items.some(
        (item) => item.label.toLowerCase() === inputValue.trim().toLowerCase(),
      );
      if (!exists) {
        const newItem = {
          id: Date.now().toString(),
          label: inputValue.trim(),
        };
        setItems((prev) => [...prev, newItem]);
        setSelectedIds((prev) => new Set(prev).add(newItem.id));
      }
      setInputValue("");
      e.preventDefault();
    }
  };

  return (
    <div className="multi-select" ref={containerRef}>
      <div className="multi-select__control" onClick={() => setIsOpen(true)}>
        {Array.from(selectedIds).map((id) => {
          const item = items.find((i) => i.id === id);
          return (
            <span key={id} className="multi-select__tag">
              {item?.label}
            </span>
          );
        })}
        <input
          type="text"
          className="multi-select__input-inline"
          placeholder={placeholder}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInputKeyDown}
          onFocus={() => setIsOpen(true)}
        />
        <div className="multi-select__icon">
          {isOpen ? (
            <ChevronUpIcon className="h-5 w-5 text-gray-600" />
          ) : (
            <ChevronDownIcon className="h-5 w-5 text-gray-600" />
          )}
        </div>
      </div>

      {isOpen && (
        <div className="multi-select__dropdown">
          <ul className="multi-select__list">
            {items.map((item) => (
              <li
                key={item.id}
                className={`multi-select__item ${
                  selectedIds.has(item.id) ? "selected" : ""
                }`}
                onClick={() => toggleSelect(item.id)}
              >
                <span>{item.label}</span>
                {selectedIds.has(item.id) && (
                  <CheckIcon className="mr-2 h-5 w-5 text-blue-500" />
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
