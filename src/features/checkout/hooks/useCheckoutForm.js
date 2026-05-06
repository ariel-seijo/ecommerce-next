import { useState, useCallback } from "react";

const RULES = {
  required: (v) => (typeof v === "string" && v.trim()) || v,
  email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  minLength: (v, min) => typeof v === "string" && v.trim().length >= min,
};

const MESSAGES = {
  required: "Requerido",
  email: "Email inválido",
  minLength: "Demasiado corto",
};

export function useCheckoutForm(fields, ruleSet) {
  const [errors, setErrors] = useState({});

  const validate = useCallback(() => {
    const errs = {};
    for (const [name, value] of Object.entries(fields)) {
      const rules = ruleSet[name];
      if (!rules) continue;
      for (const [rule, param] of Object.entries(rules)) {
        const checker = RULES[rule];
        if (!checker) continue;
        const passes = param === true ? checker(value) : checker(value, param);
        if (!passes) {
          errs[name] = MESSAGES[rule] || rule;
          break;
        }
      }
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }, [fields, ruleSet]);

  const clearError = useCallback((name) => {
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const isValid = Object.keys(errors).length === 0;

  return { errors, validate, clearError, isValid };
}
