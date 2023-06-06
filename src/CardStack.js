import React, { useState, useRef, useEffect } from 'react'
import axios from "axios";
import './CardStack.css'
import Card from './Card';
function CardStack() {
    const BASE_URL = 'https://deckofcardsapi.com/api/deck';
    const [cards, setCards] = useState([]);
    const [deck, setDeck] = useState(null);
    const [rotations, setRotations] = useState([]);
    const [autoDraw, setAutoDraw] = useState(false);
    const timerId = useRef();
    const fetchNewDeck = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/new/shuffle`);
            setDeck(result.data);

        } catch (error) {
            throw Error(error.message);
        }
    };

    useEffect(function fetchDeckWhenMounted() {
        fetchNewDeck();
    }, [setDeck]);

    const drawCard = async () => {
        try {
            let { deck_id } = deck;
            const result = await axios.get(`${BASE_URL}/${deck_id}/draw`);

            if (result.data.remaining === 0) {
                setAutoDraw(false);
                throw new Error("no cards remaining!");

            }

            let card = result.data.cards[0];
            console.log(cards);
            setCards((cards) => [...cards, { id: card.code, img: card.image }]);
            setRotations((rotations) => [...rotations, Math.floor(Math.random() * 360)]);


        } catch (error) {
            alert(error);
        }
    };

    useEffect(() => {
        // async function getCard() {
        //     try {
        //         let { deck_id } = deck;
        //         const result = await axios.get(`${BASE_URL}/${deck_id}/draw`);

        //         if (result.data.remaining === 0) {
        //             setAutoDraw(false);
        //             throw new Error("no cards remaining!");
        //         }

        //         let card = result.data.cards[0];
        //         setCards(() => [...cards, { id: card.code, img: card.image }]);
        //         setRotations(() => [...rotations, Math.floor(Math.random() * 360)]);


        //     } catch (error) {
        //         alert(error);
        //     }
        // }

        if (autoDraw && !timerId.current) {
            timerId.current = setInterval(async () => {
            //   await getCard();
                await drawCard();
            }, 1000);
          }
      
          return () => {
            clearInterval(timerId.current);
            timerId.current = null;
          };

    }, [autoDraw, setAutoDraw])




    return (
        <div>
            {deck ? <button onClick={drawCard}>Gimme a card</button> : <i>(loading)</i>}

            {deck ? (
                <button className="Deck-gimme" onClick={() => setAutoDraw((auto) => !auto)}>
                    {autoDraw ? "STOP" : "KEEP"} DRAWING FOR ME!
                </button>
            ) : null}

            <div id='card-holder'>
                {cards.map((card, idx) => {
                    return <Card img={card.img} key={card.id} alt={card.code} rotation={rotations[idx]} />
                })}
            </div>
        </div>
    )


}

export default CardStack;