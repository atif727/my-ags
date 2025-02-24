import { App } from "astal/gtk3";
import Apps from "gi://AstalApps";
import Wp from "gi://AstalWp";
import { Variable, GLib, bind } from "astal";
import { subprocess, exec, execAsync } from "astal/process";
import { Astal, Gtk, Gdk } from "astal/gtk3";
import Brightness from "./Brightness";
import Battery from "gi://AstalBattery";
import Network from "gi://AstalNetwork";
import Bluetooth from "gi://AstalBluetooth";
import Mpris from "gi://AstalMpris";

// taking length
function lengthStr(length: number) {
  const min = Math.floor(length / 60);
  const sec = Math.floor(length % 60);
  const sec0 = sec < 10 ? "0" : "";
  return `${min}:${sec0}${sec}`;
}

// used mrpis
function MediaPlayer({ player }: { player: Mpris.Player }) {
  const { START, END } = Gtk.Align;

  const title = bind(player, "title").as((t) => t || "Unknown Track");

  const artist = bind(player, "artist").as((a) => a || "Unknown Artist");

  const coverArt = bind(player, "coverArt").as(
    (c) => `background-image: url('${c}')`
  );

  const validateEntry = (entry: string | null | undefined) => {
    return entry && Astal.Icon.lookup_icon(entry)
      ? entry
      : "audio-x-generic-symbolic";
  };

  const playerIcon = bind(player, "entry").as(validateEntry);

  const position = bind(player, "position").as((p) =>
    player.length > 0 ? p / player.length : 0
  );

  const playIcon = bind(player, "playbackStatus").as((s) =>
    s === Mpris.PlaybackStatus.PLAYING
      ? "media-playback-pause-symbolic"
      : "media-playback-start-symbolic"
  );

  return (
    <box className="MediaPlayer">
      <box className="cover-art" css={coverArt} />
      <box className="hi" vertical>
        <box className="title">
          <label truncate hexpand halign={START} label={title} />
          <icon icon={playerIcon} />
        </box>
        <label halign={START} valign={START} vexpand wrap label={artist} />
        <slider
          visible={bind(player, "length").as((l) => l > 0)}
          onDragged={({ value }) => (player.position = value * player.length)}
          value={position}
        />
        <centerbox className="actions">
          <label
            hexpand
            className="position"
            halign={START}
            visible={bind(player, "length").as((l) => l > 0)}
            label={bind(player, "position").as(lengthStr)}
          />
          <box>
            <button
              css={"padding-right: 15px"}
              onClicked={() => player.previous()}
              visible={bind(player, "canGoPrevious")}
            >
              <icon icon="media-skip-backward-symbolic" />
            </button>
            <button
              onClicked={() => player.play_pause()}
              visible={bind(player, "canControl")}
            >
              <icon icon={playIcon} />
            </button>
            <button
              css={"padding-left: 15px"}
              onClicked={() => player.next()}
              visible={bind(player, "canGoNext")}
            >
              <icon icon="media-skip-forward-symbolic" />
            </button>
          </box>
          <label
            hexpand
            className="length"
            halign={END}
            visible={bind(player, "length").as((l) => l > 0)}
            label={bind(player, "length").as((l) =>
              l > 0 ? lengthStr(l) : "0:00"
            )}
          />
        </centerbox>
      </box>
    </box>
  );
}

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
  const mpris = Mpris.get_default();
  const anchor = Astal.WindowAnchor.TOP | Astal.WindowAnchor.RIGHT;
  let batteryPercInt: number = Battery.get_default().percentage * 100;
  let batteryPercS: string = "󰁹 " + batteryPercInt.toFixed(0);

  const bluetooth = Bluetooth.get_default();
  const bluestate = bluetooth.get_is_powered();

  function openbluetooth() {
    const proc = subprocess(["bash", "-c", "blueman-manager"]);
    App.get_window("sidebar")!.hide();
  }

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
          <button onClicked={openWifi} className="btnbar wifi-active">
            {network.wifi.ssid ? `  ${network.wifi.ssid}` : "󰤮  Disconnected"}
          </button>
          {/* // TODO: add a way to persist the on and off section being dynamic */}
          <button onClicked={openbluetooth} className="btnbar bluetooth">
            {bluestate ? " Bluetooth On" : "󰂲 bluetooth nai"}
          </button>
          <button
            css="font-size:100px;"
            className="btnbar"
            onClicked={powerlock}
          >
            󰌾
          </button>
        </centerbox>
        <box css="padding-bottom:15px;"></box>
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
        {/* the next lines are for hardware information piechart shit */}
        {/* // TODO : matha noshto koira labh nai astal ekta bokachoda */}
        {/* <circularprogress value={1} startAt={1} endAt={1}>
          damn wtf
        </circularprogress> */}
        <box css="padding-bottom:15px;"></box>
        {/* //* media player of mine woohoo  */}
        {bind(mpris, "players").as((arr) => {
          const lastPlayer = arr[arr.length - 2]; // Get the last index of the array (you will get alot of players, the last one has all the metadata of the current playing song)
          if (lastPlayer === undefined) {
            return <></>;
          } else {
            return (
              <box css={"margin-bottom: 20px"} halign="left" vertical>
                <MediaPlayer player={lastPlayer} />
              </box>
            );
          }
        })}
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
      </box>
    </window>
  );
}
