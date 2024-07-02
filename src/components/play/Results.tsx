import { AnimatePresence, animate, motion } from "framer-motion";
import { UserAgent } from "@quentin-sommer/react-useragent";
import { useContext, useEffect, useRef, useState } from "react";
import { TwitterShareButton, FacebookShareButton } from "react-share";
import * as htmlToImage from "html-to-image";
import GameContext from "../GameContext";
import SeededRandom from "@/utils/SeededRandom";

export default function Results() {
  const gameContext = useContext(GameContext);
  const screenshot = useRef<Blob>();
  const [totalScoreHUD, setTotalScoreHUD] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [snapReady, setSnapReady] = useState<boolean>(false);
  const [snapshot, setSnapshot] = useState<boolean>(false);
  const [clipboard, setClipboard] = useState<boolean>(false);
  const tweet = `Just scored ${gameContext.totalScore}/${
    gameContext.gameSystem.total * gameContext.gameSystem.maxRounds
  } on Eorguessr!`;

  const container = {
    visible: {
      transition: {
        delayChildren: 0.4,
        staggerChildren: 0.25,
      },
    },
  };

  const item = {
    hidden: { scale: 2, opacity: 0 },
    visible: { scale: 1, opacity: 1 },
  };

  function snap() {
    if (snapshot || !snapReady) return;
    setFlash(true);
    setSnapshot(true);
    navigator.clipboard.write([
      new ClipboardItem(
        Object.defineProperty({}, screenshot.current!.type, {
          value: screenshot.current,
          enumerable: true,
        })
      ),
    ]);
  }

  function copySeed() {
    navigator.clipboard.writeText(SeededRandom.seed!);
	setClipboard(true);
  }

  useEffect(() => {
    if (flash) {
      setTimeout(() => {
        setFlash(false);
      }, 500);
    }
  }, [flash]);

  useEffect(() => {
    if (snapshot) {
      setTimeout(() => {
        setSnapshot(false);
      }, 2000);
    }
  }, [snapshot]);

  useEffect(() => {
    if (clipboard) {
      setTimeout(() => {
        setClipboard(false);
      }, 2000);
    }
  }, [clipboard]);

  useEffect(() => {
    if (gameContext.ended) {
      setTotalScoreHUD(null);
      setTimeout(() => {
        animate(0, gameContext.totalScore, {
          duration: 1,
          onUpdate: (latest) => setTotalScoreHUD(latest),
        });

        setTimeout(() => {
          htmlToImage
            .toCanvas(document.getElementById("score")!)
            .then(function (canvas) {
              canvas.toBlob(function (blob) {
                screenshot.current = blob!;
              });
              document.getElementById(
                "screenshot"
              )!.innerHTML = `<img src="${canvas.toDataURL()}">`;
              setSnapReady(true);
            });
        }, 1500);
      }, (gameContext.gameSystem.maxRounds * 0.25 + 0.75) * 1000);
    }
  }, [gameContext.ended]);

  return (
    <div className="h-full w-full relative flex flex-col justify-center items-center">
      <div className="absolute h-full w-full bg-gradient-to-br from-slate-900 to-slate-700 z-[-1]">
        <div className="absolute h-full w-full bg-slate-900 opacity-50"></div>
      </div>

      <div className="pt-16 w-full relative flex flex-col justify-center items-center">
        <div
          id="score"
          className="w-11/12 relative justify-center items-center flex flex-col gap-4 md:gap-14 py-3 md:pt-12 pb-4 rounded-lg overflow-hidden"
        >
          <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="items-center justify-center grid grid-cols-2 md:flex md:flex-wrap md:flex-rows-3 gap-3 md:gap-16 w-11/12 md:w-10/12"
          >
            {gameContext.gameData.current.locations.map(
              (location: any, index: number) => {
                var bgURL = "url('/snapshots/" + location.id + ".webp')";
                return (
                  <motion.div
                    variants={item}
                    key={location.map.name + location.pos}
                    className="md:w-3/12 w-full relative h-32 md:h-40 xl:h-52 group flex flex-col rounded-lg overflow-hidden shadow-lg shadow-black/70"
                  >
                    <div
                      className="absolute h-full w-full bg-cover bg-center z-[-1] grayscale-[50%] group-hover:grayscale-0 duration-200"
                      style={{ backgroundImage: bgURL }}
                    ></div>
                    <div
                      className={`${
                        gameContext.gameData.current.scores[index] === 100
                          ? "bg-yellow-300/80 text-shadow shadow-black/50"
                          : "bg-slate-800/80 shadow-black/80"
                      } text-xs xl:text-base text-center font-neosans text-slate-200 py-1 shadow`}
                    >
                      {location.subArea === undefined
                        ? location.map.name
                        : location.map.menuName}{" "}
                      - {location.map.region.name}
                    </div>
                    <div
                      className={`score font-neosans text-4xl md:text-6xl grow items-center justify-center flex ${
                        gameContext.gameData.current.scores[index] === 100
                          ? "text-yellow-300"
                          : "text-slate-100"
                      } text-shadow-lg shadow-slate-900`}
                    >
                      {gameContext.gameData.current.scores[index]}
                    </div>
                    <div className="h-2 w-full bg-slate-800/90">
                      <motion.div
                        animate={{
                          width:
                            gameContext.gameData.current.scores[index] + "%",
                        }}
                        className={`h-full bg-gradient-to-br ${
                          gameContext.gameData.current.scores[index] === 100
                            ? "from-yellow-200 to-yellow-400"
                            : "from-cyan-400 to-cyan-700"
                        }`}
                      ></motion.div>
                    </div>
                  </motion.div>
                );
              }
            )}
          </motion.div>

          <div className="-skew-x-12 relative rounded-full py-1 px-7 shadow-black shadow font-neosans md:text-3xl text-slate-100 w-11/12 md:w-9/12 text-center">
            <div className="absolute top-0 rounded-full overflow-hidden left-0 h-full w-full bg-gradient-to-r from-slate-700 to-slate-600 z-[-1]">
              <div
                style={{
                  width:
                    100 *
                      (totalScoreHUD! /
                        (gameContext.gameSystem.total *
                          gameContext.gameSystem.maxRounds)) +
                    "%",
                }}
                className={`${
                  Math.round(totalScoreHUD!) <
                  gameContext.gameSystem.maxRounds *
                    gameContext.gameSystem.total
                    ? "bg-gradient-to-r from-cyan-500 via-cyan-300 to-cyan-500"
                    : "bg-gradient-to-r from-yellow-300 via-yellow-200 to-yellow-300 duration-500"
                } -skew-x-12 absolute h-full`}
              ></div>
            </div>
            {Math.round(totalScoreHUD!) ==
              gameContext.gameSystem.maxRounds *
                gameContext.gameSystem.total && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.3 }}
                className="absolute top-0 left-0 bg-white shadow-[0px_0px_8px_8px_white] h-full w-full rounded-full"
              ></motion.div>
            )}
            <span className="text-shadow shadow-black/50">
              Total score:{" "}
              <span className="text-right w-16 inline-block">
                {Math.round(totalScoreHUD!)}
              </span>{" "}
              /{" "}
              {gameContext.gameSystem.maxRounds * gameContext.gameSystem.total}
            </span>
          </div>

          {flash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.3 }}
              className="absolute top-0 left-0 bg-white/50 h-full w-full"
            ></motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            delay: gameContext.gameSystem.maxRounds * 0.25 + 2.55,
            duration: 0.5,
          }}
        >
          <div className="flex-col md:flex-row flex gap-3 md:gap-16 items-center mt-3 md:mt-7">
            <div className="flex gap-4 relative items-center justify-around">
              <div className="text-slate-400 text-xl absolute top-1/2 -left-4 -translate-y-1/2 -translate-x-full">
                <i className="fa-solid fa-share-nodes"></i>
              </div>
              <TwitterShareButton
                url={`\nhttps://eorguessr.com\n\n`}
                hashtags={["Eorguessr", "FFXIV", "FF14"]}
                title={tweet}
              >
                <div className="duration-200 -skew-x-12 rounded bg-sky-500 hover:bg-sky-400 w-14 shadow shadow-black py-2 text-slate-100 flex justify-center items-center">
                  <i className="fa-brands fa-twitter"></i>
                </div>
              </TwitterShareButton>
              <FacebookShareButton
                url={`https://eorguessr.com`}
                hashtag={"#FFXIV"}
              >
                <div className="duration-200 -skew-x-12 rounded bg-blue-600 hover:bg-blue-500 w-14 shadow shadow-black py-2 text-slate-100 flex justify-center items-center">
                  <i className="fa-brands fa-facebook-f"></i>
                </div>
              </FacebookShareButton>
              <UserAgent returnFullParser>
                {(parser: any) => {
                  if (
                    parser.getBrowser().name !== "Firefox" &&
                    parser.getBrowser().name !== "Safari"
                  )
                    return (
                      <div
                        className={` ${
                          snapReady
                            ? "duration-200 cursor-pointer bg-indigo-600 hover:bg-indigo-500 text-slate-100"
                            : "bg-slate-500 text-slate-400"
                        }  -skew-x-12 rounded w-14 shadow shadow-black py-2 flex justify-center items-center`}
                        onClick={snap}
                      >
                        {snapReady ? (
                          <i className="fa-solid fa-clipboard"></i>
                        ) : (
                          <i className="fa-solid fa-spinner animate-spin "></i>
                        )}
                      </div>
                    );
                }}
              </UserAgent>
            </div>

            {SeededRandom.seed && (
              <div className="flex items-center gap-2 -skew-x-12">
                <span className="font-semibold text-slate-200">SEED</span>
                <div
                  onClick={copySeed}
                  className="group hover:bg-slate-700 duration-300 cursor-pointer overflow-hidden text-slate-100 flex gap-3 items-center border rounded-lg border-slate-600 py-1 px-2 relative pr-12"
                >
                  <span className="font-bold select-text text-emerald-400">
                    {SeededRandom.seed}
                  </span>
                  <div className="border-l border-slate-600 bg-slate-800 duration-300 absolute right-0 top-0 group-hover:bg-slate-100 w-9 h-full flex items-center justify-center">
                    <i className="duration-300 text-slate-100 fa-solid fa-clipboard group-hover:text-slate-800"></i>
                  </div>
                </div>
                <AnimatePresence>
                  {clipboard && (
                    <motion.div
                      initial={{ opacity: 0, y: 5, x: "100%" }}
                      animate={{ opacity: 1, y: 0, x: "100%" }}
                      exit={{ opacity: 0, y: -5, x: "100%" }}
                      className="absolute -right-3 whitespace-nowrap text-slate-100 text-sm md:text-base"
                    >
						<span className="md:hidden">Copied</span>
						<span className="hidden md:block">Copied to clipboard !</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}
          </div>

          <div className={`flex justify-center my-7 md:my-10`}>
            <motion.div
              initial={{ scale: 1, skewX: -12 }}
              whileHover={{ scale: [1.1, 1] }}
              onClick={gameContext.restart}
              className="bg-slate-600 group flex hover:bg-cyan-400 text-slate-100 text-shadow shadow-black/40 rounded inline-block shadow-lg shadow-black/50 relative uppercase cursor-pointer py-2 overflow-hidden flex justify-center items-center"
            >
              <span className="ml-6 skew-x-12 translate-x-[20px] group-hover:translate-x-0 duration-200 font-neosans text-lg lg:text-2xl 4k:text-3xl tracking-wide italic inline-block">
                Restart
              </span>
              <div className="px-5 flex justify-center items-center text-xl skew-x-12">
                <motion.span
                  animate={{ x: [-3, 3, -3] }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <i className="-translate-x-[20px] group-hover:translate-x-[0px] duration-200 opacity-0 group-hover:opacity-100 fa-solid fa-backward"></i>
                </motion.span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                whileHover={{ opacity: [1, 0] }}
                transition={{ duration: 0.2 }}
                className="absolute top-0 left-0 bg-white h-full w-full"
              ></motion.div>
            </motion.div>
          </div>
        </motion.div>

        <AnimatePresence>
          {snapshot && (
            <motion.div
              initial={{ opacity: 0, y: 100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -100 }}
              transition={{ duration: 0.2 }}
              className="origin-bottom-right fixed bottom-4 right-4 flex flex-col"
            >
              <div className="bg-slate-600 text-slate-100 rounded mb-2 shadow shadow-black p-1 text-center">
                Screenshot saved in your clipboard!
              </div>
              <div className="w-80 border-2 rounded border-slate-400 overflow-hidden">
                <img
                  src={
                    document
                      .getElementById("screenshot")
                      ?.children[0].getAttribute("src")!
                  }
                ></img>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div id="screenshot" className="hidden"></div>
      </div>
    </div>
  );
}
