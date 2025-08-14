import styles from './PolicyAndMore.module.css'

const CookiesPage = () => {
    return (
        <div>
            <h1 className={styles.header}>Cookies Policy</h1>
            <span className={styles.span} >Last updated: 14.08.2025</span>
            <div className={styles.body} >

                1. What Are Cookies?
                Cookies are small text files that are stored on your device when you use our app or visit our website. They help us remember your preferences, recognize your device, and improve your overall experience.

                2. How We Use Cookies
                We use cookies and similar technologies for the following purposes:

                To make the app work properly and provide core features

                To remember your settings and preferences

                To understand how users interact with our app (analytics)

                To personalize your experience and suggest relevant content

                To display personalized advertisements, where applicable

                3. Types of Cookies We Use
                We use different types of cookies, such as:

                Essential cookies, which are necessary for the app to function

                Analytics cookies, which help us understand app usage and improve performance

                Functional cookies, which store your preferences like language or theme

                Advertising cookies, which allow us to show you more relevant ads

                4. Third-Party Cookies
                We may also work with trusted third parties (such as analytics or advertising partners) who place cookies on your device through our app. These third parties may use their own cookies in accordance with their privacy policies.

                5. Managing Cookies
                You can control or disable cookies through your device or browser settings. Please note that disabling certain cookies may affect the functionality of the app.

                If you’d like to learn how to manage cookies, you can visit help pages for common browsers such as Chrome, Safari, or Firefox.

                6. Updates to This Policy
                We may update this Cookies Policy from time to time. If there are significant changes, we will notify you through the app or by email.

            </div>
        </div>
    )
}
export default CookiesPage;