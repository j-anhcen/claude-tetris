# Clima

Obtén el clima actual de una ciudad usando Open-Meteo (sin API key).

## Pasos

1. Recibe el nombre de la ciudad desde los argumentos: `$ARGUMENTS`
2. Usa WebFetch para geocodificar la ciudad:
   `https://geocoding-api.open-meteo.com/v1/search?name=<CIUDAD>&count=1&language=es&format=json`
3. Extrae `latitude`, `longitude`, y `name` del primer resultado.
4. Usa WebFetch para obtener el clima actual:
   `https://api.open-meteo.com/v1/forecast?latitude=<LAT>&longitude=<LON>&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code,apparent_temperature&wind_speed_unit=kmh&timezone=auto`
5. Interpreta el `weather_code` según WMO:
   - 0: Despejado
   - 1-3: Parcialmente nublado
   - 45-48: Neblina
   - 51-67: Llovizna/Lluvia
   - 71-77: Nieve
   - 80-82: Chubascos
   - 95-99: Tormenta eléctrica
6. Muestra resultado en formato conciso:
   ```
   Ciudad: <nombre>
   Temperatura: <temp>°C (sensación <apparent>°C)
   Humedad: <humidity>%
   Viento: <wind> km/h
   Condición: <descripción>
   ```
