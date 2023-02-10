import React, { useRef, useState, useEffect } from "react";
import { Segment, Transcript, OpenAiDictionary } from "utils/transcription";
import TranscriptView from "components/TranscriptView/TranscriptView";
import { LoadingStatus } from "components/App/App";
import { getClassNames } from "./AudioPlayer.classNames";
import { createTheme, DefaultButton, IIconStyles, ITheme, PrimaryButton, Separator, Stack, TextField } from "@fluentui/react";
import { IStackTokens } from '@fluentui/react/lib/Stack';
import { Text } from '@fluentui/react/lib/Text';
import { useBoolean } from '@fluentui/react-hooks';

interface AudioPlayerProps {
  src: string; 
  transcript: Transcript;
  transcriptLoadingStatus: LoadingStatus;
  fullTranscriptObject: OpenAiDictionary;
}

function AudioPlayer({
  src,
  transcript,
  transcriptLoadingStatus,
  fullTranscriptObject,
}: AudioPlayerProps) {
  const classNames = getClassNames();

  const audioRef = useRef<HTMLAudioElement>(null);
  const [currentSeconds, setCurrentSeconds] = useState(0);

  const handleTimeUpdate = () => {
    if (audioRef.current == null || transcript.length === 0) return;
    setCurrentSeconds(audioRef.current.currentTime);
  };

  const handleSetTime = (segment: Segment) => {
    if (!audioRef.current) return;
    const newTime = segment.offset / 1000;
    setCurrentSeconds(newTime);
    audioRef.current.currentTime = newTime;
  };
  
  // Azure OpenAI 
  const [check, setCheck] = useState("");

  const callOpenAI = async(prompt: string) => {

    try{
      const api_key = process.env.API_KEY;
      const base_url =  process.env.AOAI_ENDPOINT;
      const deployment_name = process.env.DEPLOYMENT_NAME;
      const url = base_url + "/openai/deployments/" + deployment_name + "/completions?api-version=2022-12-01";

      const headers = {
        "api-key": api_key,
        "Content-Type": "application/json"
      };

      let output = '';
      const response = fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "api-key": api_key as string,
          Accept: "application/json",
        },
        body:    JSON.stringify(   {
          "temperature": 0,
          "max_tokens":600,
          "prompt" : prompt
          })
        })
        .then(function(response){ 
          return response.json()})
          .then(function(data)
          {console.log(data);
            // console.log("OpenAI Response", data);
            console.log("OpneAI", data.choices[0].text);
            setCheck(data.choices[0].text);
          })
        .catch((error) => {
          //Promise.reject(error);
          console.log(error)
        });

    } catch (e) {
      console.error("Error calling OpenAI", e);
    }

  }
    
  function handleChange(event : React.ChangeEvent<HTMLInputElement>) {
    console.log(event.target.value);
    setMessage(event.target.value);
  }

  const [message, setMessage] = useState('');

  const [updated, setUpdated] = useState(message);


  const handleClick = async () => {
    // "message" stores input field value
    setUpdated(message);
    console.log("Final Message", message);

    var prompt = "Please answer the question from the below text \n###" + fullTranscriptObject.conversation + "\n###\n" + message + "\nAnswer:";

    const { text } = await( await fetch(`/api/QueryOpenAI`)).json();
    console.log(text)

    var data = callOpenAI(prompt);
    

  };


  //let loadMoreInfo = useBoolean(false);
  //let loadMoreInfo = false
  const handleReadMoreClick = () => {
    
    //loadMoreInfo = true;
  };

  const stackTokens: IStackTokens = { childrenGap: 12 };

  const theme: ITheme = createTheme({
    fonts: {
      small: {
        fontFamily: 'Segoe UI',
        fontSize: '30px',
      },
    },
  });
  

  console.log("typeof", typeof(fullTranscriptObject.summary))
  console.log("my transcript", Object.keys(fullTranscriptObject).length !== 0, fullTranscriptObject)
  // Object.keys(fullTranscriptObject).forEach(k => {
  //   console.log(k, ':');
  // });

  let oai;
  const style = {
    //border: '1px solid',
    color: 'black',
  };
  
  // const relatedConvStyle = {
  //   border: '1px solid',
  //   color: 'black',
  // };

  let ner;
  let key_items;
  let topics;
  let relatedConversations;
  
  if (Object.keys(fullTranscriptObject).length !== 0)
  {
    //const loadMoreInfo = useBoolean(false);

    ner = fullTranscriptObject.ner.map(str => <span style= {style}> {str} <br/></span>);
    key_items = fullTranscriptObject.key_items.map(str => <span style= {style}> {str} <br/></span>);
    topics = fullTranscriptObject.topic.map(str => <span style= {style}> {str} <br/></span>);
    relatedConversations = fullTranscriptObject.related.map((convers, i) => (
      //<div style= {relatedConvStyle}>
      <div className="relatedConv">
        <span > <tr key={i}>
        <br/>
        <div className="filename"><b>Filename: </b> {convers.id}<br/></div>
        <div className="timestamp"><b>Date: </b> {convers.timestamp}<br/></div>
        <div className="related"><b> Conversation relevance(%): </b> {Math.round(convers.score* 100)}%<br/></div>
        <div className="summary"><b>Conversation Summary: </b> {convers.summary}<br/></div></tr></span>
        <DefaultButton text="Load more" style={{alignItems:'center'}} onClick={handleReadMoreClick}></DefaultButton>
        
        {/* { loadMoreInfo && (
        
            <div className="summary"><b>Conversation Summary: </b> {convers.summary}<br/></div>

          )
        } */}

            <Separator theme={theme}></Separator><br/>
      </div>

  ))
    //let relatedConversations = fullTranscriptObject.related.map(str => <span style= {style}> {str} <br/></span>);

    oai =<div className={'oaiinsightsRightPanel'}>
            <h3 style={{textAlign: "left", color: '#264ebb'}}>Overall Sentiment:</h3>
            <div >
              {(() => {
                if (fullTranscriptObject.sentiment === 'Positive') {
                  return (
                    <h4 style={{ color: '#05b005'}}>{fullTranscriptObject.sentiment}</h4>
                  )
                } else if (fullTranscriptObject.sentiment === 'Negative') {
                  return (
                    <h4 style={{ color: "red"}}>{fullTranscriptObject.sentiment}</h4>
                  )
                } else {
                  return (
                    <h4 style={{ color: "black"}}>{fullTranscriptObject.sentiment}</h4>
                  )}
              })()}
            <Separator theme={theme}></Separator>

            <h3 style={{textAlign: "left", color: '#264ebb'}}>Category: </h3>
            <span style={style}> {fullTranscriptObject.category}</span>
            <Separator theme={theme}></Separator>

            <h3 style={{textAlign: "left", color: '#264ebb'}}>Entities Recognized:</h3>
            {/* {fullTranscriptObject.ner.join('\r\n')} */}
            {ner}
            {/*fullTranscriptObject.ner*/}
            <Separator theme={theme}></Separator>

            <h3 style={{textAlign: "left", color: '#264ebb'}}>Key discussion topics:</h3>
            {/* {fullTranscriptObject.topic.join('\r\n')} */}
            {/*fullTranscriptObject.topic.map(str => <p>{str}</p>)*/}
            {/*fullTranscriptObject.topic*/}
            {topics}
            <Separator theme={theme}></Separator>

            <h3 style={{textAlign: "left", color: '#264ebb'}}>Key Items:</h3>
            {/*fullTranscriptObject.key_items.join(',')*/}
            {/*fullTranscriptObject.key_items*/}
            {key_items}
            <Separator theme={theme}></Separator>


            </div>

        </div>
       
  }

  return (
    <div>
      <audio 
        ref={audioRef}
        controls
        autoPlay={transcriptLoadingStatus === "successful"}
        controlsList="nodownload"
        onContextMenu={(e) => e.preventDefault()}
        onTimeUpdate={handleTimeUpdate}
        src={src}
        className={classNames.audioPlayer}
      >
        Your browser does not support the audio element
      </audio>
      <div className={'bigblue'}>
      <h2 style={{textAlign: "center"}}>Conversation Summary</h2>
        {fullTranscriptObject.summary}
        <br/>
      </div>
      <Separator theme={theme}></Separator>

      <div className={'bigblue'} style= {{alignItems:'center'}}>
        <div><h3> Find out more! Ask anything here:</h3></div>
        <Stack horizontal horizontalAlign="space-evenly" style={{ display: "flex"}}>
          <input name="openaiQuestion" style={{ width:"100%" }} placeholder="Type your question here..." onChange={handleChange} value={message}>
          </input>
          <DefaultButton text="Submit" onClick={handleClick}>Update</DefaultButton>
        </Stack>
        <Separator theme={theme}></Separator>
        <div>
          {check}
        </div>
      </div>
      <Stack tokens={stackTokens}>
        <Separator theme={theme}></Separator>
      </Stack>

      <Stack horizontal horizontalAlign="space-evenly">
            <div style={{ display: "flex" , alignItems: 'left'}}>

              <TranscriptView
                transcript={transcript}
                loadingStatus={transcriptLoadingStatus}
                currentSeconds={currentSeconds}
                fullTranscriptObject={fullTranscriptObject} onSetTime={function (segment: Segment): void {
                  throw new Error("Function not implemented.");
                } }
              />
              <div className={'middlePanel'}>
                <Stack><h2 style={{textAlign: "center", color: '#264ebb'}}>Call Highlights</h2></Stack>
                <Stack className={'oaiinsightsRightPanel'}>
                  {oai}
                  </Stack>   
              </div>
              <div>
              <Stack><h2 style={{textAlign: "center", color: '#264ebb'}}>Explore more:</h2></Stack>
              
              <div className={'rightHandPanel'}>
              <h3 style={{textAlign: "left", color: '#264ebb'}}>Top 5 most relevant conversations:</h3>
                <div className="relatedConv">{relatedConversations}</div>
                <Separator theme={theme}></Separator>
                </div>
              </div>
            </div>
            
      
    </Stack>
      
      
    </div>
  );
}

export default AudioPlayer;
