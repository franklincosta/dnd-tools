import {useState, useEffect} from 'react';
import axios from 'axios';
import papacsv from 'papaparse';
import Toast from 'react-bootstrap/Toast';

function UploadItens(){

    const [selectedFile, setSelectedFile] = useState();
    const [objItensHeader, setObjItensHeader] = useState([]);
    const [objItens, setObjItens] = useState([]);
    const [showA, setShowA] = useState(false);


    const toggleShowA = () => setShowA(!showA);

    const changeHandlerFile = (event) => {
		setSelectedFile(event.target.files[0]);
	};
    const changeHandlerFileSend = (event) => {
        let fileCsv = selectedFile;
        papacsv.parse(fileCsv, {
            complete:function(resCSV){
                getHTMLDocument()
                .then(function(resHTML){
                    console.log('resHTML',resHTML);
                    createObjItens(resCSV.data, resHTML);
                });  
            }
        })

	};
    
    const mountObj = (obj, objhtml) => {
        let objItensCSV = [];
        for(var o = 0; o < obj.length; o++){
            if(o === 0){
                setObjItensHeader([
                    obj[o][0],
                    obj[o][1],
                    obj[o][2],
                    obj[o][3],
                    "Descrição"
                ])
                continue;
            }
            let item_desc = null;
            for(let ob = 0; ob < objhtml.length; ob++){
                let csvName = obj[o][0].toLowerCase().trim();
                let itemName = objhtml[ob].title.toLowerCase().trim();
                if(csvName == itemName){
                    item_desc = objhtml[ob].desc;
                    break;
                }
            }
            objItensCSV.push({
                item_name:obj[o][0],
                item_price:obj[o][1],
                item_pagedmgmm:obj[o][2],
                item_rarity:obj[o][3],
                item_desc:item_desc
            });
        }
        objItensCSV.sort();
        for(let i = 0; i < objItensCSV.length; i++){
            if(!objItensCSV[i].item_desc){
                console.log(objItensCSV[i].item_name);
            }
        }
        setObjItens(objItensCSV);
        console.log('objItens',objItensCSV);
    }
    const createObjItens = (objCSV, objHTML) =>{
        mountObj(objCSV, objHTML);
    }
   
    const sendItensDnd = () => {
        let itensDnd = objItens;
        axios.post('http://localhost:3636/upload-itens/itens-dnd',itensDnd)
        .then(function(res){
            console.log(res)
            if(res.data.status == 'success') toggleShowA();
        });
    }
    function getTextChilds(parent){

        let textHTML = parent.innerText;

        if(parent.nextElementSibling && parent.nextElementSibling.nodeName != 'H3'){
            textHTML += "<br>" + getTextChilds(parent.nextElementSibling);
        }
        return textHTML;
    }

    async function getHTMLDocument(){
        console.log('Obtendo html.');
        return axios.get('http://localhost:3000/dnd-tools/html/dd-5e-guia-do-mestre-biblioteca-elfica-151-215-v4.html')
        .then(function(res){
            let objItensAll = [];
            const htmlObject = document.createElement('html');
            htmlObject.innerHTML = res.data;
            const containerHTML = htmlObject.querySelector('body').childNodes;
            let objItens = {
                "title":null,
                "desc":null
            };
            let cleanHTML = [];
            containerHTML.forEach(element => {
                if(element.nodeName != 'text') cleanHTML.push(element);
            });
            const allTitles = cleanHTML.filter((elem)=>elem.nodeName == 'H3');
            allTitles.forEach(element => {
                if(element.innerText){
                    objItens.title = element.innerText;
                    objItens.desc = getTextChilds(element.nextElementSibling)
                    objItensAll.push(objItens);
                    objItens = {
                        "title":null,
                        "desc":null
                    };
                }
            })
            return objItensAll;
        });
    }   

    return(
        <div className="container-uploaditens mt-3">
            <div className="col mb-3">
                <form>
                    <h2>Envia lista de itens</h2>
                    <div className="mb-3">
                        <label htmlFor="csvFile" className="form-label">Escolher arquivo</label>
                        <input type="file" className="form-control" id="csvFile" name="csvFile" onChange={changeHandlerFile}/>
                    </div>
                    <button type="button" className="btn btn-primary"
                    onClick={changeHandlerFileSend}>Visualizar</button>
                </form>
            </div>
            {objItens.length > 0 && 
                <div className="col mb-3">
                    <button className="btn btn-success"
                    onClick={sendItensDnd}>Enviar tabela</button>
                    <table className="table table-dark table-striped">
                        <thead>
                            <tr>
                                {objItensHeader.map((elem, idx)=>(
                                    <th key={idx}>{elem}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {objItens.map((item, idx)=>(
                                <tr key={idx}>
                                    <th>{item.item_name}</th>
                                    <th>{item.item_price}</th>
                                    <th>{item.item_pagedmgmm}</th>
                                    <th>{item.item_rarity}</th>
                                    <th dangerouslySetInnerHTML={{__html: item.item_desc}} ></th>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            }
             <Toast onClose={toggleShowA} show={showA} animation={false}>
                <Toast.Header>
                    <img
                    src="holder.js/20x20?text=%20"
                    className="rounded me-2"
                    alt=""
                    />
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>Woohoo, you're reading this text in a Toast!</Toast.Body>
            </Toast>
        </div>
    )
}
export default UploadItens;