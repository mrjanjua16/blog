import { Footer } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { BsFacebook, BsInstagram, BsTwitter, BsGithub, BsDribbble } from 'react-icons/bs';

export default function FooterCom() {
  return (
    <Footer container className="border-t border-gray-200 bg-white dark:bg-gray-900">
      <div className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 sm:flex sm:justify-between sm:items-center">
          <div className="flex flex-col items-center sm:items-start">
            <Link to="/" className="text-2xl font-bold text-gray-800 dark:text-white">
              <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
                Blog
              </span>
            </Link>
            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Insights, stories, and ideas.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            <div>
              <Footer.Title title="About" className="text-gray-800 dark:text-gray-200" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">
                  Projects
                </Footer.Link>
                <Footer.Link href="/about" target="_blank" rel="noopener noreferrer" className="hover:text-indigo-500">
                  Blog
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Follow us" className="text-gray-800 dark:text-gray-200" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="hover:text-indigo-500">
                  Github
                </Footer.Link>
                <Footer.Link href="#" className="hover:text-indigo-500">
                  Discord
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
            <div>
              <Footer.Title title="Legal" className="text-gray-800 dark:text-gray-200" />
              <Footer.LinkGroup col>
                <Footer.Link href="#" className="hover:text-indigo-500">
                  Privacy Policy
                </Footer.Link>
                <Footer.Link href="#" className="hover:text-indigo-500">
                  Terms &amp; Conditions
                </Footer.Link>
              </Footer.LinkGroup>
            </div>
          </div>
        </div>
        <Footer.Divider />
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-6">
          <Footer.Copyright href="#" by="Blog" year={new Date().getFullYear()} />
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Footer.Icon href="#" icon={BsFacebook} className="text-gray-500 hover:text-indigo-500" />
            <Footer.Icon href="#" icon={BsInstagram} className="text-gray-500 hover:text-indigo-500" />
            <Footer.Icon href="#" icon={BsTwitter} className="text-gray-500 hover:text-indigo-500" />
            <Footer.Icon href="#" icon={BsGithub} className="text-gray-500 hover:text-indigo-500" />
            <Footer.Icon href="#" icon={BsDribbble} className="text-gray-500 hover:text-indigo-500" />
          </div>
        </div>
      </div>
    </Footer>
  );
}
