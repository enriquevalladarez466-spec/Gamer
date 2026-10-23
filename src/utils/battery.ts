/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback } from 'react';
import { BatteryInfo } from '../types/bridge';

interface BatteryManager extends EventTarget {
  charging: boolean;
  chargingTime: number;
  dischargingTime: number;
  level: number;
  addEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
  removeEventListener(type: string, listener: EventListenerOrEventListenerObject): void;
}

interface NavigatorWithBattery extends Navigator {
  getBattery?: () => Promise<BatteryManager>;
}

export function useBattery() {
  const [battery, setBattery] = useState<BatteryInfo>({
    level: 78,
    charging: false,
    chargingTime: Infinity,
    dischargingTime: 14400, // 4 hours
    temperature: 31.8,
    health: 'Buena',
    voltage: 4.12,
    isRealApi: false,
    powerSaverActive: false,
  });

  const [simulatedLevel, setSimulatedLevel] = useState<number | null>(null);
  const [simulatedCharging, setSimulatedCharging] = useState<boolean | null>(null);

  useEffect(() => {
    let batteryManager: BatteryManager | null = null;
    const nav = navigator as NavigatorWithBattery;

    const updateBatteryInfo = (manager: BatteryManager) => {
      setBattery(prev => ({
        ...prev,
        level: Math.round(manager.level * 100),
        charging: manager.charging,
        chargingTime: manager.chargingTime,
        dischargingTime: manager.dischargingTime,
        isRealApi: true,
        temperature: manager.charging ? 34.2 : 30.5,
        voltage: manager.charging ? 4.35 : 4.05,
      }));
    };

    if (typeof nav.getBattery === 'function') {
      nav.getBattery()
        .then(manager => {
          batteryManager = manager;
          updateBatteryInfo(manager);

          const onLevelChange = () => updateBatteryInfo(manager);
          const onChargingChange = () => updateBatteryInfo(manager);
          const onChargingTimeChange = () => updateBatteryInfo(manager);
          const onDischargingTimeChange = () => updateBatteryInfo(manager);

          manager.addEventListener('levelchange', onLevelChange);
          manager.addEventListener('chargingchange', onChargingChange);
          manager.addEventListener('chargingtimechange', onChargingTimeChange);
          manager.addEventListener('dischargingtimechange', onDischargingTimeChange);
        })
        .catch(() => {
          // Fallback handled by default state
        });
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  const setManualBatteryLevel = useCallback((level: number) => {
    setSimulatedLevel(level);
    setBattery(prev => ({
      ...prev,
      level,
      temperature: level < 20 ? 28.5 : 32.1,
      voltage: +(3.6 + (level / 100) * 0.6).toFixed(2),
    }));
  }, []);

  const toggleManualCharging = useCallback(() => {
    setBattery(prev => {
      const nextCharging = !prev.charging;
      setSimulatedCharging(nextCharging);
      return {
        ...prev,
        charging: nextCharging,
        dischargingTime: nextCharging ? Infinity : 18000,
        temperature: nextCharging ? 34.6 : 30.8,
        voltage: nextCharging ? 4.38 : 4.02,
      };
    });
  }, []);

  const togglePowerSaver = useCallback(() => {
    setBattery(prev => ({
      ...prev,
      powerSaverActive: !prev.powerSaverActive,
    }));
  }, []);

  return {
    battery,
    setManualBatteryLevel,
    toggleManualCharging,
    togglePowerSaver,
    isOverridden: simulatedLevel !== null || simulatedCharging !== null,
  };
}
