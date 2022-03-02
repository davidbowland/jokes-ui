import { Authenticator } from '@aws-amplify/ui-react'
import '@aws-amplify/ui-react/styles.css'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import React from 'react'

import SignedIn from './signed-in'
import { DisplayedJoke } from '@types'

export interface AdminProps {
  joke?: DisplayedJoke
  setJoke: (joke: DisplayedJoke | undefined) => void
}

const Admin = ({ joke, setJoke }: AdminProps): JSX.Element => {
  return (
    <section className="site-administration">
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography>Site Administration</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            <Authenticator>
              {({ signOut }) => <SignedIn joke={joke} signOut={signOut} setJoke={setJoke} />}
            </Authenticator>
          </Typography>
        </AccordionDetails>
      </Accordion>
    </section>
  )
}

export default Admin
