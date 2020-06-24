import React, {Component} from 'react';
import MenuItem from '../../components/menu-components/MenuItem'
import '../../styles/menu.css'

class Menu extends Component {

    constructor(props) {
        super(props)
        
        this.state = {
            menus: []
        }
    }

    componentDidMount = () => {
        this.setState({menus: this.props.data})
    }

    render() {
        return (
            <div className="container-fluid shadow" id="menu">
                <div className="row align-items-center mx-0 w-100">
                    <div className="col-12 mx-0 px-0" id="category1">
                        <div className="d-flex w-100 py-2 title"><strong>View</strong></div>
                        <hr style={borderStyle}/>
                        <div className="w-100 py-2 title text-muted">
                                {
                                    this.state.menus.map(menu => {
                                        if(menu.category === "View") {
                                            return <MenuItem 
                                                        key={this.state.menus.indexOf(menu)} 
                                                        menu={menu} 
                                                        value={`${menu.category}-${menu.name}`}/>
                                        } else {return null}
                                    })
                                }
                        </div>
                    </div>
                    <div className="col-12 mx-0 px-0" id="category2">
                        <div className="d-flex w-100 py-2 title"><strong>Add</strong></div>
                        <hr style={borderStyle}/>
                        <div className="w-100 py-2 title text-muted">
                            {
                                this.state.menus.map(menu => {
                                    if(menu.category === "Add") {
                                        return <MenuItem 
                                                    key={this.state.menus.indexOf(menu)} 
                                                    toggle={this.handler} 
                                                    menu={menu} 
                                                    value={`${menu.category}-${menu.name}`}
                                                />
                                    } else {return null}
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const borderStyle = {
    borderColor: '#333',
    margin: '0'
}

export default Menu;