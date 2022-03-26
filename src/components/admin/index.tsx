import '@aws-amplify/ui-react/styles.css'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { Authenticator } from '@aws-amplify/ui-react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import React from 'react'

import { DisplayedJoke } from '@types'
import SignedIn from './signed-in'

export interface AdminProps {
  joke?: DisplayedJoke
  setJoke: (joke: DisplayedJoke | undefined) => void
}

const Admin = ({ joke, setJoke }: AdminProps): JSX.Element => {
  return (
    <section className="site-administration">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>Site Administration</AccordionSummary>
        <AccordionDetails>
          <Authenticator hideSignUp={true}>
            {({ signOut }) => <SignedIn joke={joke} setJoke={setJoke} signOut={signOut} />}
          </Authenticator>
        </AccordionDetails>
      </Accordion>
    </section>
  )
}

export default Admin
