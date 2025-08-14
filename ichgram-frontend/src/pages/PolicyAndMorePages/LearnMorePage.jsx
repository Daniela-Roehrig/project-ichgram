import styles from './PolicyAndMore.module.css'

const LearnMorePage = () => {
    return (
        <>
            <h1 className={styles.header}>Learn more</h1>

            <div className={styles.body} >
                When someone using our service uploads their contacts, your email address or phone number may be included if it is saved in their address book.

                Ichgram uses this information to help you find friends or suggest connections.

                You have the right to:

                Check whether Ichgram has your contact information.

                Request that your contact information be removed if you don’t have an account or prefer not to be included.

                For more information and to manage your data, please contact us!
            </div>
        </>
    )
}
export default LearnMorePage;