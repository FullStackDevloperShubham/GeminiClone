import { createContext, useState } from "react";
import run from "../config/Gemini";

export const Context = createContext()


const ContextProvider = (props) => {

  const [input, setInput] = useState("")
  const [recentPrompt, setRecentPrompt] = useState("")
  const [prevPrompts, setPrevPrompts] = useState([])
  const [showResult, setShowResult] = useState(false)
  const [loading, setLoading] = useState(false)
  const [resultData, setResultData] = useState("")

  const delaypara = (index, nextWord) => {
    setTimeout(function () {
      setResultData(prev => prev + nextWord)
    }, 75 * index)
  }

  const newChat = () => {
    setLoading(false)
    setShowResult(false)
  }




  const onSent = async (prompt) => {

    setResultData("")
    setLoading(true)
    setShowResult(true)
    let responce;
    if (prompt !== undefined) {
      responce = await run(prompt)
      setRecentPrompt(prompt)
    } else {
      setPrevPrompts(prev => [...prev, input])
      setRecentPrompt(input)
      responce = await run(input)
    }



    let responceArray = responce.split("**")
    let newResponce = "";
    for (let i = 0; i < responceArray.length; i++) {
      if (i == 0 || i % 2 !== 1) {
        newResponce += responceArray[i]
      }
      else {
        newResponce += "<b>" + responceArray[i] + "</b>"
      }
    }

    let newResponce2 = newResponce.split("*").join("</br>")
    // setResultData(newResponce2)
    let newResponceArray = newResponce2.split(" ")
    for (let i = 0; i < newResponceArray.length; i++) {
      const nextWord = newResponceArray[i]
      delaypara(i, nextWord + " ")
    }
    setLoading(false)
    setInput("")

  }


  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    setRecentPrompt,
    recentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  }

  return (
    <Context.Provider value={contextValue}>
      {props.children}
    </Context.Provider>
  )

}

export default ContextProvider
