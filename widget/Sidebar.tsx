import { App } from "astal/gtk3";
import Apps from "gi://AstalApps";
import Wp from "gi://AstalWp";
import { Variable, GLib, bind } from "astal";
import { subprocess, exec, execAsync } from "astal/process";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Brightness from "./Brightness";
import Battery from "gi://AstalBattery";
import Network from "gi://AstalNetwork";

const network = Network.get_default();

function BrightnessSlider() {
  const brightness = Brightness.get_default();

  return (
    <box className="AudioSlider" css="min-width: 140px">
      <slider
        hexpand
        value={bind(brightness, "screen")}
        onDragged={({ value }) => (brightness.screen = value)}
      />
    </box>
  );
}

function AudioSlider() {
  const speaker = Wp.get_default()?.audio.defaultSpeaker!;

  return (
    <box className="AudioSlider" css="min-width: 140px">
      <slider
        hexpand
        onDragged={({ value }) => (speaker.volume = value)}
        value={bind(speaker, "volume")}
      />
    </box>
  );
}

// function MicrophoneSlider() {
//   const microphone = Wp.get_default()?.audio.defaultMicrophone!;

//   return (
//     <box className="AudioSlider" css="min-width: 140px">
//       <slider
//         hexpand
//         onDragged={({ value }) => (microphone.volume = value)}
//         value={bind(microphone, "volume")}
//       />
//     </box>
//   );
// }

function BatteryUi() {
  const batteryPerc: number = Battery.get_default().percentage * 100;
  return;
}

function openwallpaper() {
  const proc = subprocess(["bash", "-c", "waypaper"]);
  App.get_window("sidebar")!.hide();
}

function openwallpapereffects() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/wallpaper-effects.sh",
  ]);
  App.get_window("sidebar")!.hide();
}

function openwaybarthemes() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/waybar/themeswitcher.sh",
  ]);
  App.get_window("sidebar")!.hide();
}

function powerlock() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/power.sh lock",
  ]);
  App.get_window("sidebar")!.hide();
}

function powerlogout() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/power.sh exit",
  ]);
  App.get_window("sidebar")!.hide();
}

function powersuspend() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/power.sh suspend",
  ]);
  App.get_window("sidebar")!.hide();
}

function powerrestart() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/power.sh reboot",
  ]);
  App.get_window("sidebar")!.hide();
}

function powerexit() {
  const proc = subprocess([
    "bash",
    "-c",
    "$HOME/.config/hypr/scripts/power.sh shutdown",
  ]);
  App.get_window("sidebar")!.hide();
}

function openWifi() {
  const proc = subprocess([
    "bash",
    "-c",
    "~/.config/ml4w/settings/networkmanager.sh",
    // "literally nmtui",
  ]);
  App.get_window("sidebar")!.hide();
}

export default function Sidebar() {
  const anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT;
  let batteryPercInt: number = Battery.get_default().percentage * 100;
  let batteryPercS: string = "󰁹 " + batteryPercInt.toFixed(0);

  return (
    <window
      name="sidebar"
      application={App}
      visible={false}
      className="Sidebar"
      anchor={anchor}
      keymode={Astal.Keymode.ON_DEMAND}
      onKeyPressEvent={function (self: any, event: Gdk.Event) {
        if (event.get_keyval()[1] === Gdk.KEY_Escape) self.hide();
      }}
    >
      <box className="sidebar" vertical>
        <centerbox css="min-width:360px;">
          <button onClicked={openWifi} className="btnbar wifi">
            {`  ${network.wifi.ssid}` || "󰤮 Disconnected"}
          </button>
          <button className="btnbar bluetooth">afsdfjhfkjasfhksjfhdkf</button>
          <button
            css="font-size:100px;"
            className="btnbar lock"
            onClicked={powerlock}
          >
            󰌾
          </button>
        </centerbox>
        <box css="padding-bottom:20px;"></box>
        <box className="group" halign="left" vertical>
          {/* <label css="padding-bottom:10px; margin-right:350px" label="󰕾 Speaker"></label>
          <AudioSlider /> */}
          <box>
            <label
              css="padding-bottom:10px; padding-right:8px; font-size:20px;"
              label="󰕾 "
            ></label>
            <AudioSlider />
          </box>
          <box>
            <label
              css="padding-bottom:10px; padding-right:8px; font-size:20px;"
              label="󰃠 "
            />
            <BrightnessSlider />
          </box>
        </box>
        {/* <box css="padding-bottom:20px;"></box> */}
        {/* <box className="group" halign="left" vertical>
          
        </box> */}
        <box css="padding-bottom:15px;"></box>
        <centerbox horizontal>
          <label vexpand label=""></label>
          <box>
            <label css="margin-left: 5px" label={batteryPercS}></label>
            <button
              css="margin-left:350px;"
              onClicked={powerexit}
              className="last exit"
            ></button>
          </box>
          <label vexpand label=""></label>
        </centerbox>
        {/* the next lines are for hardware information piechart shit */}
        {/* <circularprogress value={1} startAt={0.75} endAt={0.75}>
          <icon />
        </circularprogress> */}
        {/* <icon css="font-size: 16px;" icon={GLib.get_os_info("LOGO") || "missing-symbolic"} /> */}
        {/* <levelbar value={0.6}/> */}
      </box>
    </window>
  );
}
