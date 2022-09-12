import {useState, useEffect } from 'react';
import { NumericFormat } from 'react-number-format';


import axios from 'axios';
function GetItens(){
    const [listItensHeader, setListItensHeader] = useState([
        {header_name:'item_name',header_text:'Nome do Item', order:'asc'},
        {header_name:'item_price',header_text:'Preço do Item', order:'asc'},
        {header_name:'item_pagedmgmm',header_text:'Página DMG/MM', order:'asc'},
        {header_name:'item_rarity',header_text:'Raridade', order:'asc'},
    ]);
    const [listItens, setListItens] = useState([]);
    const [currentItens, setCurrentItens] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [itensPerPage, setItensPerPage] = useState(0);
    const [itemStart, setItemStart] = useState(0);
    const [fieldSearchFilter, setFieldSearchFilter] = useState("");
    const [headerSearchFilter, setHeaderSearchFilter] = useState(listItensHeader[0].header_name);

    async function getItens(){
        //const res = await axios.get('http://localhost:3636/get-itens/itens-dnd');
        const res = await axios.get('./json/itens_dnd_json.json');
        let itensRes = res.data;
        for(let r = 0; r < itensRes.length; r++){
            let parsePrice = parseFloat(itensRes[r].item_price);
            if(!isNaN(parsePrice)){
                itensRes[r].item_price = parsePrice;
            }
        }
        itensRes = itensRes.sort((a, b)=> a.item_name > b.item_name ? 1 : -1);
        setListItens(itensRes);
        return res.data.itens;
    }
    function sortItens(headerOrder){
        let itensRes = [...listItens];
        let headerItens = [...listItensHeader];
        let arrItensString = itensRes.filter((a)=> typeof a[headerOrder.header_name] === 'string');
        let arrItensNumber = itensRes.filter((a)=> typeof a[headerOrder.header_name] === 'number');
        if(headerOrder.order == 'asc') {
            arrItensString = arrItensString.sort((a, b)=> a[headerOrder.header_name] > b[headerOrder.header_name] ? 1 : -1);
            arrItensNumber = arrItensNumber.sort((a, b)=> a[headerOrder.header_name] > b[headerOrder.header_name] ? 1 : -1);
            itensRes = [...arrItensNumber, ...arrItensString];

            for(let o = 0; o < headerItens.length; o++) headerItens[o].order = 'desc'; 
            
        }else if(headerOrder.order == 'desc'){
            arrItensString = arrItensString.sort((a, b)=> a[headerOrder.header_name] < b[headerOrder.header_name] ? 1 : -1);
            arrItensNumber = arrItensNumber.sort((a, b)=> a[headerOrder.header_name] < b[headerOrder.header_name] ? 1 : -1);
            itensRes = [...arrItensString, ...arrItensNumber];            
            for(let o = 0; o < headerItens.length; o++) headerItens[o].order = 'asc'; 
        }
        setOffsetItens();
        setListItensHeader(headerItens);
        setListItens(itensRes);
    }
    function setOffsetItens(){
        const endOffset = itemStart + itensPerPage;
        setCurrentItens(listItens.slice(itemStart, endOffset));
        setTotalPages(Math.ceil(listItens.length / itensPerPage));
    }
    useEffect(()=>{
        getItens()
        .then(function(){
            setItensPerPage(10);
            setOffsetItens();
        });
    },[itemStart, itensPerPage]);

    const handlePageClick = (event) => {
        const newOffset = (event.selected * itensPerPage) % listItens.length;
        setItemStart(newOffset);
    };
    function filterTable(e){
        let textSearch = e.target.value;
        setFieldSearchFilter(textSearch);
        console.log(headerSearchFilter);
    }
    function filterChangeHeader(e){
        let headerSearch = e.target.value || listItensHeader[0].header_name;
        setHeaderSearchFilter(headerSearch);
    }

    return(
        <div>
            <form>
                <div className="row mt-3 align-items-center">
                    <div className="col-sm-12 col-md-auto">
                        <label htmlFor="searchInput" className="col-form-label">Buscar:</label>
                    </div>
                    <div className="col-sm-12 col-md-auto mb-2 mb-sm-0">
                        <input type="text" id="searchInput" className="form-control"
                        onChange={filterTable}/>
                    </div>
                    <div className="col-sm-12 col-md-auto mb-2 mb-sm-0">
                        <select className="form-select" aria-label="Default select example"
                        onChange={filterChangeHeader}>
                            <option defaultValue value="item_name">Escolha o campo</option>
                            <option value="item_name">Nome do item</option>
                            <option value="item_price">Preço do item</option>
                            <option value="item_pagedmgmm">Página DMG/MM</option>
                            <option value="item_rarity">Raridade</option>
                        </select>
                    </div>
                </div>
            </form>
            <table className="table table-dark table-striped mb-3">
                <thead>
                    <tr>
                        {listItensHeader.map((header, idx)=>(
                            <th 
                            key={idx}
                            onClick={() => sortItens(header)}>{header.header_text}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {listItens
                    .filter((a) => a[headerSearchFilter].toString().toLowerCase().includes(fieldSearchFilter.toString().toLowerCase()))
                    .map((item, idx) => (
                        <tr key={idx}>
                            <td>{item.item_name}</td>
                            <td>
                                {typeof item.item_price !== 'string' && 
                                 <NumericFormat
                                 value={item.item_price} 
                                 allowLeadingZeros 
                                 thousandSeparator="."
                                 decimalSeparator=","
                                 displayType="text"
                                 />
                                }
                                {typeof item.item_price === 'string' && item.item_price}
                           </td>
                            <td>{item.item_pagedmgmm}</td>
                            <td>{item.item_rarity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* {totalPages > 0 && <ReactPaginate
                breakLabel="..."
                nextLabel="next >"
                onPageChange={handlePageClick}
                pageRangeDisplayed={5}
                pageCount={totalPages}
                previousLabel="< previous"
                renderOnZeroPageCount={null}
             />} */}
            
        </div>
    )
}

export default GetItens;