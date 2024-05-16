from setuptools import setup, find_packages

setup(
    name="environment_selector",
    version="0.2.0",
    packages=find_packages(where='src'),
    package_dir={'': 'src'},
    description="Handle data types for data management tasks",
    author="Thiago Borba",
    author_email="thiago.borba@icloud.com",
    install_requires=[],
)
