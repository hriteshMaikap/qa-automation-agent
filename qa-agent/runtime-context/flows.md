# Cockpit runtime flows

flows.md is versioned alongside the product. When a feature is added or
changed, a human (or a reviewed agent pass) updates the relevant anchor
BEFORE any scenario referencing it is regenerated. A diff to this file
signals scenario-generator to re-evaluate scenarios pointing at the
changed anchor. Scenario Generator must never invent new expected
behavior here from code alone — this file is the oracle, not a derivative.

Source basis: `README.md`, `docs/reference.md`, and the cockpit page, components, and device-subscription hook. No reviewed runtime product brief is present; the evaluation-only `qa-agent/meta/` material is intentionally excluded.

## cockpit-connects-and-loads-devices

Trigger: The operator opens the Cockpit.

Expected observable behavior: The Cockpit connects its socket, loads the device list, selects the first drone when no prior selection remains, and shows the socket status badge. The device list shows a row for each drone with its dock and flight-status pills.

Timing: The README states that the connected badge, four initial drones, and telemetry numbers should appear within about 30 seconds.

## device-selection-and-map-pan

Trigger: The operator selects a drone in the device list or clicks a drone/dock entity on the map.

Expected observable behavior: The Cockpit selects that drone and shows its name, flight-status pill, telemetry, and FPV video. Selecting a device-list row also pans the map to that device. A map click on a drone selects it; a dock click selects its associated drone.

Timing: The source sets map pan duration to 0.8 seconds.

## drone-telemetry-display

Trigger: The selected drone receives telemetry.

Expected observable behavior: The telemetry panel displays the selected drone's flight status plus battery, altitude RLT/AGL/ASL, horizontal and vertical speed, heading, dock wind, and distance from home. Unavailable numeric telemetry is displayed as an em dash.

Timing: `flight_status`, battery, and dock telemetry are published at 1 Hz; global position and attitude are published at 2 Hz.

## takeoff-produces-in-air-flight-status

Trigger: The operator chooses **Take off** for an on-ground drone in the control panel, or a client sends `POST /api/control/command` with `{ "deviceId": "drone-1", "type": "takeoff" }`.

Expected observable behavior: The Cockpit status pill and selected device row first show `taking_off`, then show `in_flight`. The published `flight_status` payload has `in_air: true` while airborne; the control-panel Take off button becomes disabled and Land becomes enabled. The README further states that the drone climbs to 30 m, flies at 10 m/s in a straight line, and draws a track on the map.

API payload field: `in_air` (boolean). UI display value: `in_flight` (string).

Timing: `flight_status` is published at 1 Hz. TODO: confirm threshold for reaching `in_flight`.

## landing-returns-a-drone-to-ground-state

Trigger: The operator chooses **Land** for an airborne drone in the control panel, or a client sends the `land` command to the control API.

Expected observable behavior: The control panel enables Land only while `in_air` is true. The README states that landing brings the drone down where it is.

Timing: TODO: confirm threshold for landing completion.

## map-device-and-track-visualization

Trigger: Device position, status, or selection telemetry changes.

Expected observable behavior: The map renders docks and drones with labels; a drone label includes its current flight status. It renders a height reference for a device above ground and renders a track when at least two drone positions have been received. The operator can choose 2D or 3D map view.

Timing: The source sets each 2D/3D camera transition to 0.8 seconds and the initial map fly-to to 1.5 seconds.

## fpv-video-display-and-recovery

Trigger: The selected drone has an enabled video payload with a URL, or the operator changes the selected drone.

Expected observable behavior: The FPV tile identifies the selected drone and displays `connecting`, `live`, or `reconnecting`; without an enabled video URL it displays `off` and `Video off`. The README says each drone has a different looping aerial clip, so switching drones changes the footage. When playback fails or stalls, the player reconnects.

Timing: The source retries a failed video connection after 1.5 seconds and treats 4 seconds without playback progress as a stall.

## socket-status-and-reconnect

Trigger: The Cockpit socket connects, is kicked, or is refused.

Expected observable behavior: The status badge displays `socket connecting`, `socket connected`, `socket reconnecting`, or `socket disconnected`. After a server-side disconnect, the client reconnects; after a refused handshake, it retries.

Timing: The source retries a server-side disconnect after 1 second and a refused handshake after 2 seconds.

## alert-toast-display-and-dismissal

Trigger: A device sends an alert.

Expected observable behavior: The Cockpit displays a status toast containing the device id and alert message. The operator can dismiss it.

Timing: The source automatically dismisses each toast after 6 seconds.
