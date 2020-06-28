import React, {Component} from 'react';
import {Main, Title} from '../components'
import styled from 'styled-components'

const Content = styled.div.attrs({
    className: 'py-2 item text-center w-100 align-items-center'
})``

const Text = styled.h3.attrs({
    className: 'py-4 my-auto'
})``

class NoPermission extends Component {

    render() {
        return (
            <Main>
                <Content>
                    <Title title={"No Permission"} />
                    <Text>
                        Only logged-in users have permission to use this section.
                    </Text>
                </Content>
            </Main>
        )
    }
}

export default NoPermission;