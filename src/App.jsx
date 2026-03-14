import { useState, useEffect } from "react";
import { Input } from "./components/input";
import { BrowserRouter } from "react-router";

function App() {
  const [ch1, setch1] = useState(0);
  const [ch2, setch2] = useState(0);
  const [ch3, setch3] = useState(0);
  const [ch4, setch4] = useState(0);
  const [ch5, setch5] = useState(0);
  const [consomations, setConsomations] = useState([]);
  const [montant, setMontant] = useState(0);
  const [prixUnitaire, setPrixUnitaire] = useState(0);
  const [totalconsomation, setTotalconsomation] = useState(0);
  const [isclicked, setIsclicked] = useState(false);
  const [isdone, setIsDone] = useState(false);


  const date = new Date();
  const currentMonth = date.toLocaleString("default", { month: "long" });
 
  
  

  useEffect(() => {
    const storedConso = localStorage.getItem("consomations");
    if (storedConso) {
      setConsomations(JSON.parse(storedConso));
    }
  }, []);

  useEffect(() => {
    if (consomations.length > 0) {
      localStorage.setItem("consomations", JSON.stringify(consomations));
    } else {
      localStorage.removeItem("consomations");
    }
  }, [consomations]);

  const handlecalc = () => {
    if (ch1 === 0 || ch2 === 0 || ch3 === 0 || ch4 === 0 || ch5 === 0) {
      alert("REMPLISSEZ TOUS LES CHAMPS!!!");
      return;
    } else {
      const data = {
        ch1: Number(ch1),
        ch2: Number(ch2),
        ch3: Number(ch3),
        ch4: Number(ch4),
        ch5: Number(ch5),
      };
      setConsomations([...consomations, data]);
      console.log(consomations);
      setIsclicked(true);
    }
  };

  const getOldConsomation = () => {
    if (consomations.length > 0) {
      return consomations[consomations.length - 2];
    }
    return null;
  };

  const getDifference = () => {
    const oldConso = getOldConsomation();
    if (!oldConso) return null;

    const currentData = {
      ch1: Number(ch1),
      ch2: Number(ch2),
      ch3: Number(ch3),
      ch4: Number(ch4),
      ch5: Number(ch5),
    };

    return {
      ch1: currentData.ch1 - oldConso.ch1,
      ch2: currentData.ch2 - oldConso.ch2,
      ch3: Number(4),
      ch4: currentData.ch4 - oldConso.ch4,
      ch5: currentData.ch5 - oldConso.ch5,
    };
  };

  const calcul = () => {
    if (montant === 0) {
      alert("ENTRER LE MONTANT");
      return;
    } else {
      const difference = getDifference();

      if (difference) {
        console.log("Différences de consommation :", difference);
        const totalDiff = Object.values(difference).reduce((a, b) => a + b, 0);
        setTotalconsomation(totalDiff);
        const montantparunite = montant / totalDiff;
        setPrixUnitaire(montantparunite);
        setIsDone(true);
      }
    }
  };
  return (
    <BrowserRouter>
     <div className=" flex items-center justify-center p-16 flex-col gap-6">
      <div className="grid grid-cols-2 gap-4 bg-base-300 rounded-lg shadow-lg p-10">
        <Input
          value={ch1 === 0 ? "" : ch1}
          setvalue={setch1}
          label={"chambre 1"}
        />
        <Input
          value={ch2 === 0 ? "" : ch2}
          setvalue={setch2}
          label={"chambre 2"}
        />
        <Input
          value={ch3 === 0 ? "" : ch3}
          setvalue={setch3}
          label={"chambre 3"}
        />
        <Input
          value={ch4 === 0 ? "" : ch4}
          setvalue={setch4}
          label={"chambre 4"}
        />
        <Input
          value={ch5 === 0 ? "" : ch5}
          setvalue={setch5}
          label={"chambre 5"}
        />

        <button className="btn bg-green-700 w-full mt-7" onClick={handlecalc}>
          Envoyer
        </button>
      </div>
      <div>
        {isclicked && (
          <div className=" flex gap-4 justify-center items-center">
            <Input
              value={montant === 0 ? "" : montant}
              setvalue={setMontant}
              label={"Montant total"}
            />
            <button className="btn btn-accent mt-6" onClick={calcul}>
              Calculer
            </button>
          </div>
        )}
      </div>

      {consomations.length > 0 && isdone && (
        <div className="w-full flex justify-center items-center flex-col">
          <h2 className="text-2xl font-bold mb-4">Facture du mois de {currentMonth}</h2>
          <div className=" flex justify-center items-center bg-base-300 rounded-lg shadow-lg w-40 py-2 text-2xl text-red-500 font-bold">
            <p>PU : {prixUnitaire.toFixed(2)}</p>
          </div>
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Chambre</th>
                  <th>Ancienne Consommation</th>
                  <th>Nouvelle Consommation</th>
                  <th>Différence</th>
                  <th>Montant</th>
                  <th>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((num) => {
                  const oldConso = getOldConsomation();
                  const newConso = Number(eval(`ch${num}`));
                  const diff =
                    num === 3
                      ? 4
                      : newConso - (oldConso ? oldConso[`ch${num}`] : 0);

                  return (
                    <tr key={num}>
                      <td>Chambre {num}</td>
                      <td>{oldConso ? oldConso[`ch${num}`] : "-"}</td>
                      <td>{newConso || "-"}</td>
                      <td>{diff}</td>
                      <td>{Math.floor(diff * prixUnitaire)}</td>
                      <td className="text-green-600 font-bold text-xl">
                        {Math.floor(diff * prixUnitaire) + 150 + " FCFA"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
    </BrowserRouter>
   
  );
}

export default App;
