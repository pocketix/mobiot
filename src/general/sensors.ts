import { VarObject } from "./interfaces";

export const sensors: VarObject[] = [
    { name: 'DistanceSensor-1.waterLevel', value: {type: 'number',value: '', args: []}},
    { name: 'BaterySensor-1.percentageLevel', value: {type: 'number',value: '', args: []}},
    { name: 'DistanceSensor-1.distance', value: {type: 'number',value: '', args: []}},
    { name: 'Doorbell-1.motionSensor', value: {type: 'bool',value: '', args: []}},
    { name: 'LT22222Relay-1.relayState', value: {type: 'bool',value: '', args: []}},
    { name: 'TemperatureDevice-1.temperatureLevel', value: {type: 'number',value: '', args: []}},    
    { name: 'LED-1.currentLedColor', value: {type: 'string',value: '', args: []}},
    { name: 'LightSensor.isDark', value: {type: 'bool',value: '', args: []}}
];