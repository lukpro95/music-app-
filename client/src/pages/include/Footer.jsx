import React, {Component} from 'react';
import '../../styles/footer.css'
import styled from 'styled-components'

const Line = styled.div.attrs({
    className: 'line'
})``

const FooterWrapper = styled.div.attrs({
    className: 'text-center w-100',
    id: 'footer'
})``

class Footer extends Component {

    render() {
        return (
            <Line>
                <FooterWrapper>
                    <p>Copyright &copy; 2020 MusicPedia App</p>
                </FooterWrapper>
            </Line>
        )
    }
}

export default Footer;