import React from 'react';

const ShowMessage = (props) => (
    <span>
        <i className="fa fa-spinner fa-spin" /> {props.msg ? props.msg :"Cargando..."}
    </span>
);

export default ShowMessage;