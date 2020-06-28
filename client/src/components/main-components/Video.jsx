import React from 'react'

class Video extends React.Component {
    render() {
        return (
            <div className="d-flex p-5 item mr-4 justify-content-center col-6">
            {(this.props.link === null || this.props.link === "") ? 
                <div className="text-muted small"><em>We are sorry! No video has been added yet.</em></div> : 
                <iframe title={this.props.title} src={`https://www.youtube.com/embed/${this.props.link}`} frameBorder="1" allow="encrypted-media; gyroscope;" allowFullScreen={false}></iframe>
            }
            </div>
        )
    }
}

export default Video