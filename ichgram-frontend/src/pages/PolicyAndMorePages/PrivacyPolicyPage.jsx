import styles from './PolicyAndMore.module.css'

const PrivacyPolicyPage = () => {
    return (
        <>
            <h1 className={styles.header}>Privacy Policy</h1> 
            <span className={styles.span} >Last updated: 14.08.2025</span>
            <div className={styles.body} >
                This Privacy Policy explains how we collect, use, and protect your personal information when you use our app.

                1. What Information We Collect
                We may collect the following types of personal data:

                Account Information: Username, email address, password

                Profile Data: Profile photo, bio, location (optional)

                User Content: Photos, videos, comments, likes, and messages

                Device Information: Device type, operating system, language, IP address

                Usage Data: How you interact with the app (e.g. what you view or click)

                Location Data: If you allow it, we may collect your approximate or precise location

                2. How We Use Your Information
                We use your personal data to:

                Provide and improve the functionality of the app

                Personalize your feed and suggestions

                Communicate with you (e.g. send updates, security alerts)

                Monitor app performance and usage

                Show you relevant ads, if applicable

                Enforce our Terms of Use and prevent abuse

                3. Sharing Your Data
                We do not sell your personal information.
                We may share your data:

                With third-party service providers (e.g. cloud hosting, analytics)

                When required by law or legal processes

                To protect the rights, safety, or property of users or the platform

                With your consent or when you share content publicly

                4. Your Rights
                Depending on your location, you may have rights such as:

                Accessing the personal data we hold about you

                Requesting correction or deletion of your data

                Withdrawing consent at any time

                Objecting to or limiting certain types of data use

                You can access, update, or delete your data in the app settings or by contacting us.

                5. Data Retention
                We keep your data for as long as necessary to provide our services or as required by law. If you delete your account, your data will be removed or anonymized, unless legal obligations require otherwise.

                6. Security
                We use appropriate security measures to protect your personal data. However, no system is completely secure, so we cannot guarantee absolute protection.

                7. Children’s Privacy
                Our app is not intended for children under the age of 13 (or 16 in some regions). We do not knowingly collect personal data from children without parental consent.

                8. Changes to This Policy
                We may update this Privacy Policy from time to time. Significant changes will be announced via the app or email.

                9. Contact
                If you have questions or concerns about this Privacy Policy, please contact us at:
                [your-support@email.com]


            </div>
        </>
    )
}
export default PrivacyPolicyPage;