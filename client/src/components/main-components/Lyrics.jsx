import React from 'react'

class Lyrics extends React.Component {
    render() {
        return (
            <div className="w-100 p-5 item col-6">
                <h3 className="title mb-4">Lyrics</h3>
                {(this.props.text === null || this.props.text === "") ? 
                <div className="text-muted small"><em>No lyrics added.</em></div> : 
                    <pre className="lyrics" style={style}>{
`${this.props.text}`
                    }</pre>
                }
            </div>
        )
    }
}

const style = {
    color: 'white',
    fontSize: '18px',
}

export default Lyrics