export type KPIEntry = {
  type: string;
  dev: { name: string; value: boolean }[];
};


export let KPIs: { [key: string]: KPIEntry } = {
    leaking: {type: 'alert', dev: [
        { name: 'DistanceSensor-1', value: true },
        { name: 'BaterySensor-1', value: false },
        { name: 'DistanceSensor-2', value: true },
        { name: 'TemperatureDevice-1', value: false },
        { name: 'LightSensor-1', value: false },
    ]},
    turnedOn: {type: 'info', dev: [
        { name: 'BaterySensor-1', value: true },
        { name: 'Doorbell-1', value: false },
        { name: 'LT22222Relay-1', value: true },
        { name: 'TemperatureDevice-1', value: true },
        { name: 'LED-1', value: true },
        { name: "wateringGreen-1", value: true },
        { name: "vacuumCleaner-1",value: false }
    ]},
    deviceOnline: {type: 'info', dev: [
        { name: 'DistanceSensor-1', value: true },
        { name: 'BaterySensor-1', value: true },
        { name: 'DistanceSensor-2', value: true },
        { name: 'Doorbell-1', value: true },
        { name: 'LT22222Relay-1', value: false },
        { name: 'TemperatureDevice-1', value: false },
        { name: 'LED-1', value: true },
        { name: 'LightSensor-1', value: false },
        { name: "wateringGreen-1", value: true },
        { name: "vacuumCleaner-1",value: false }
    ]},
    criticalBatery: {type: 'alert', dev: [
        { name: 'DistanceSensor-1', value: false },
        { name: 'DistanceSensor-2', value: true },
        { name: 'Doorbell-1', value: false },
        { name: 'TemperatureDevice-1', value: false },
        { name: "LED-1", value: true },
        { name: "vacuumCleaner-1",value: true }
    ]},
    anomalyDetected: {type: 'alert', dev: [
        { name: 'DistanceSensor-1', value: false },
        { name: 'BaterySensor-1', value: false },
        { name: 'DistanceSensor-2', value: false },
        { name: 'Doorbell-1', value: true },
        { name: 'LT22222Relay-1', value: false },
        { name: 'TemperatureDevice-1', value: false },
        { name: 'LED-1', value: true },
        { name: 'LightSensor', value: false },
        { name: "wateringGreen-1", value: true },
        { name: "vacuumCleaner-1",value: false }
    ]},
    sensorError: {type: 'alert', dev: [
        { name: 'DistanceSensor-1', value: false },
        { name: 'BaterySensor-1', value: true },
        { name: 'DistanceSensor-2', value: true },
        { name: 'Doorbell-1', value: false },
        { name: 'TemperatureDevice-1', value: false },
        { name: 'LED-1', value: true },
        { name: 'LightSensor', value: false },
    ]},
};