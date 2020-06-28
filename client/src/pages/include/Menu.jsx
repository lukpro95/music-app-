import React, {Component} from 'react';
import {MenuItem} from '../../components/'
import '../../styles/menu.css'
import styled from 'styled-components'

const Container = styled.div.attrs({
    className: 'container-fluid shadow', 
    id: 'menu'
})``

const Category = styled.div.attrs({
    className: 'category'
})``

const Title = styled.div.attrs({
    className: 'd-flex w-100 py-2 title'
})``

const SubTitle = styled.div.attrs({
    className: 'w-100 py-2 title text-muted'
})``

const Line = styled.hr``

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
            <Container>
                    <Category>
                        <Title>View</Title>
                        <Line />
                        <SubTitle>
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
                        </SubTitle>
                    </Category>
                    <Category>
                        <Title>Add</Title>
                        <Line />
                        <SubTitle>
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
                        </SubTitle>
                    </Category>
            </Container>
        )
    }
}

export default Menu;