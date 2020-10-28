import React from 'react';

const items = ["social", "economic", "climate", "combination"];

const listItems = (selection: string) =>
    items.map(item => <li className={selection === item ? "selected" : undefined}><a href={"?type="+item}>{item}</a></li>)


const Navigation = ({selection}: {selection: string}) =>
    <nav>
        <ul>
            {listItems(selection)}
        </ul>
    </nav>

export default Navigation;