import { StatusBar } from "expo-status-bar";
import {
  StyleSheet,
  Text,
  View,
  Platform,
  SafeAreaView,
  Pressable,
} from "react-native";
import { useEffect, useState } from "react";
import Header from "./.expo/src/components/Header";
import Timer from "./.expo/src/components/Timer";
import { Audio } from "expo-av";

const colors = ["#F7DC6F", "#A2D9CE", "#D7BDE2"];

export default function App() {
  const [time, setTime] = useState(25 * 60);
  const [currentTime, setCurrentTime] = useState("POMO" | "SHORT" | "BREAK");
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isActive) {
        setTime((prevTime) => prevTime - 1);
      }
      if (time === 0) {
        Alarma();
        setIsActive(false);
        setTime(
          currentTime === 0 ? 25 * 60 : currentTime === 1 ? 5 * 60 : 15 * 60
        );
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [isActive, currentTime, time]);

  const handleStartStop = () => {
    playSound();
    setIsActive(!isActive);
  };

  const playSound = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/SoundClick.mp3")
    );
    await sound.playAsync();
  };

  const Alarma = async () => {
    const { sound } = await Audio.Sound.createAsync(
      require("./assets/alarmaGallo.mp3")
    );
    await sound.playAsync();
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors[currentTime] }]}
    >
      <View
        style={{
          flex: 1,
          paddingHorizontal: 15,
          paddingTop: (Platform.OS = "android" ? 30 : 0),
        }}
      >
        <Text style={{ fontSize: 32, fontWeight: "bold" }}>POMODORO</Text>
        <Header
          setTime={setTime}
          currentTime={currentTime}
          setCurrentTime={setCurrentTime}
          setIsActive={setIsActive}
        />
        <Timer time={time} />
        <Pressable onPress={handleStartStop} style={styles.button}>
          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            {isActive ? "STOP" : "START"}
          </Text>
        </Pressable>
        <StatusBar style="auto" />
        {/* para los estilos de la hora, bateria, etc */}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  button: {
    backgroundColor: "#333",
    padding: 15,
    borderRadius: 5,
    marginVertical: 20,
    width: "100%",
    alignItems: "center",
    borderRadius: 15,
  },
});
