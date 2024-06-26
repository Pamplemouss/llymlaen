import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { expansionsValid } from "@/components/CookiesManager";
import generateSeed from "@/utils/generateSeed";

export default function Home() {
  const [cookies, setCookie] = useCookies(["expansions", "seed"]);
  const [seed, setSeed] = useState<string>("");
  const [expansions, setExpansions] = useState<string[]>();
  const playUrl = "/play";

  useEffect(() => {
    setCookie("expansions", expansions, { sameSite: "strict" });
  }, [expansions]);

  useEffect(() => {
    setExpansions(
      expansionsValid(cookies.expansions) ? cookies.expansions : ["ARR"]
    );
  }, []);

  useEffect(() => {
    setCookie("seed", seed, { sameSite: "strict" });
  }, [seed]);

  function expClick(expansion: string) {
    if (!expansions?.includes(expansion))
      setExpansions([...expansions!, expansion]);
    else {
      expansions.splice(expansions.indexOf(expansion), 1);
      setExpansions([...expansions!]);
    }
  }

  function generateNewSeed() {
    for (let i = 0; i < 10; i++) {
      console.log(i);
      setTimeout(() => {
        setSeed(generateSeed());
      }, i * 40);
    }
  }

  const element =
    expansions?.length === 1 && cookies.expansions[0] === "ShB" ? (
      <span className="text-shadow shadow-violet-500/40 text-violet-400">
        Darkness
      </span>
    ) : (
      <span className="text-shadow shadow-yellow-200/20 text-yellow-200">
        Light
      </span>
    );

  return (
    <>
      <div className="h-16 4k:h-24 w-full"></div>
      <div className="relative mt-7 h-full w-full flex flex-col">
        <div className="relative h-full w-full flex flex-col md:justify-center items-center">
          <div className="fixed top-0 left-0 h-full w-full home-background grayscale z-[-1]"></div>
          <div className="fixed top-0 left-0 h-full w-full bg-slate-800/90 z-[-1]"></div>

          <div className="border-2 border-x-[#c0a270] border-y-[#e0c290] w-11/12 md:w-10/12 4k:w-8/12 bg-gradient-to-br from-slate-800 to-slate-700 relative p-2 md:px-3 md:py-2 text-slate-300 font-myriad text-sm xl:text-base 4k:text-3xl shadow-lg shadow-black/50 rounded-lg mb-4 xl:mb-10">
            <div className="text-center">Welcome Warrior of {element} !</div>
            How much time did you spend in Eorzea? You will be dropped at random
            places in the{" "}
            <span className="text-emerald-400">
              critically acclaimed Final Fantasy XIV Online MMORPG
            </span>
            , and will have to guess where you are. Select the expansions you
            want to play with, click &quot;Play&quot; and have fun!

            <div className="flex items-center gap-3 text-base 4k:text-xl text-yellow-200 rounded mt-1">
                <span>If you have any extra gils to support server hosting, here is the <a className="duration-200 px-1 text-yellow-400 text-shadow shadow-yellow-900 hover:shadow-yellow-600 hover:underline" rel="noreferrer" href="https://ko-fi.com/pamplemouss" target="_blank">Ko-fi</a></span>
            </div>
          </div>

          <div className="flex-wrap justify-center w-full flex md:flex-flow-col md:flex-rows-3 gap-10 md:w-10/12 4k:w-8/12 4k:gap-16">
            {["ARR", "HW", "SB", "ShB", "EW"].map((expansion) => {
              var disabled = false;
              var tap = disabled ? {} : { scale: [1.2, 1] };
              var hover = disabled ? {} : { y: -4 };
              var transition = disabled ? { duration: 0.5 } : { duration: 0.1 };
              return (
                <motion.div
                  key={expansion}
                  onClick={() => (disabled ? null : expClick(expansion))}
                  initial={{ scale: 1, skewX: -12 }}
                  whileHover={hover}
                  whileTap={tap}
                  transition={transition}
                  className={`vignette ${expansion} ${
                    expansions?.includes(expansion)
                      ? "active shadow-[0px_0px_20px_8px_rgb(0,0,0)] border-4 4k:border-8"
                      : null
                  } ${
                    disabled
                      ? "disabled opacity-50 cursor-not-allowed backdrop-blur-xl"
                      : "cursor-pointer backdrop-blur-sm"
                  } w-9/12 h-32 md:h-28 md:w-3/12 xl:h-44 -skew-x-12 group overflow-hidden shadow-lg shadow-black/50 relative py-4 px-16 rounded-xl`}
                >
                  <div
                    className={`bg mix-blend-color-dodge absolute top-0 left-0 h-full w-full opacity-20 z-10`}
                  ></div>
                  <div
                    className={`duration-100 bgImage ${expansion}-bg skew-x-12 absolute top-0 -left-4 h-full w-[110%]`}
                  ></div>
                  <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                    <div
                      className={`left-bar absolute top-0 left-0 ${
                        disabled ? "bg-slate-800" : "bg-white/50"
                      } h-full w-1.5 4k:w-2 rounded-xl`}
                    ></div>
                  </div>
                  <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                  <div
                    className={`reflect duration-200 absolute opacity-0 top-0 ${
                      disabled
                        ? ""
                        : "group-hover:left-3/4 group-hover:opacity-100"
                    } left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10`}
                  ></div>
                  <span className="font-neosans text-4xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12 text-slate-200"></span>

                  {disabled ? (
                    <motion.div className="active:text-red-500 absolute top-0 left-0 w-full h-full flex justify-center items-center text-slate-400 text-8xl z-20 opacity-70">
                      <i className="text-shadow-lg shadow-black fa-solid fa-ban"></i>
                    </motion.div>
                  ) : null}

                  <motion.div
                    initial={{ opacity: 0 }}
                    whileTap={{ opacity: disabled ? 0 : [1, 0] }}
                    transition={{ duration: 0.2 }}
                    className="absolute top-0 left-0 bg-white/50 h-full w-full z-10"
                  ></motion.div>
                </motion.div>
              );
            })}
          </div>

          <div className="flex flex-col mt-10 mb-2 items-center">
            <span className="px-3 text-slate-300 font-myriad text-sm">
              <span className="text-emerald-400">Soft Multiplayer: </span>
              <span>
                If you want to test yourself against some friends, use the same
                seed and same expansions to play a game with the same zones
              </span>
            </span>
            <div className="relative">
              <input
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="font-mono w-36 text-sm text-emerald-400 px-2 py-0.5 rounded placeholder:text-slate-500 placeholder:text-sm mt-1 bg-slate-700 max-w-sm appearance-none"
                type="text"
                placeholder="Seed"
              />
              <div
                onClick={generateNewSeed}
                className="active:translate-y-0.5 flex items-center justify-center cursor-pointer bg-slate-100 rounded-full w-6 h-6 absolute top-1 -right-2 translate-x-full"
              >
                <i className="text-slate-800 fa-solid fa-refresh"></i>
              </div>
            </div>
          </div>

          <div className="mt-8 md:mt-4 mb-10 md:mb-6">
            <div
              className={`${
                expansions?.length === 0
                  ? "text-red-500 shadow-red-900"
                  : "text-yellow-300"
              } translate-x-2 text-center text-shadow uppercase -skew-x-12 mb-3 font-myriad`}
            >
              Select at least 1 expansion!
            </div>
            <a href={playUrl}>
              <motion.div
                initial={{ scale: 1, skewX: -12 }}
                whileHover={{ scale: [1.2, 1] }}
                transition={{ duration: 0.1 }}
                className={`${
                  expansions?.length === 0
                    ? "pointer-events-none opacity-30"
                    : " hover:shadow-sky-500 hover:from-sky-700 hover:to-sky-400"
                } text-slate-200 border-slate-100/70  block border-4 4k:border-8 -skew-x-12 group duration-100 shadow-lg shadow-black/50 relative uppercase bg-gradient-to-br from-gray-800/50 to-gray-700/50 cursor-pointer py-4 px-16 rounded-xl`}
              >
                <div className="overflow-hidden absolute top-0 left-0 h-full w-full scale-[0.95] rounded-xl">
                  <div className="absolute top-0 left-0 group-hover:bg-white/50 bg-white/50 h-full w-1.5 4k:w-2 rounded-xl"></div>
                </div>
                <div className="absolute top-0 left-0 h-full w-12 bg-gradient-to-r from-white/40 to-white/0"></div>
                <div className="duration-200 absolute group-hover:opacity-100 opacity-0 top-0 group-hover:left-3/4 left-1/2 h-full w-4 bg-gradient-to-r from-white/20 to-white/10 "></div>
                <span className="font-neosans text-4xl 4k:text-6xl text-shadow shadow-black/20 tracking-wide italic inline-block skew-x-12">
                  Play
                </span>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: [1, 0] }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-0 left-0 bg-white h-full w-full"
                ></motion.div>
              </motion.div>
            </a>
          </div>

          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: "100%", transition: { delay: 1 } }}
            whileHover={{ y: "20%", transition: { delay: 0 } }}
            className="fixed w-24 4k:w-48 bottom-10 4k:bottom-20 right-0 4k:right-8 p-3"
          >
            <Link href="/info">
              <img src="/moogle.webp"></img>
            </Link>
          </motion.div>
        </div>
      </div>
      <div className="text-shadow shadow-black z-10 mb-2 absolute text-center w-full text-slate-400 text-sm font-myriad pointer-events-none">
        FINAL FANTASY XIV © 2010 - 2023 SQUARE ENIX CO., LTD. All Rights
        Reserved.
      </div>
    </>
  );
}
