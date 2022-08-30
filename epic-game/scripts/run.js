const main = async () => {
    const gameContractFactory = await hre.ethers.getContractFactory("MyEpicGame");
    const gameContract = await gameContractFactory.deploy(
        ["Han Solo", "Obi-Wan", "Rey", "Luke Skywalker", "Yoda"],
        [
            "bafkreifob3l3s3c7xlrfgwa3tm4unpmrwmlbfimryk2o5retaiolyvffyu",
            "bafkreih36snwfkay65uej7nfza4adxm53j3ft3s27tcz7kodrgk74rfa2q",
            "bafkreif7htyau65bymumojl32fcqhotppz55rcpsv25wvd7jems7apfrou",
            "bafkreia2rqfwxyhqpjs72gbtixziuofdy55c6bj5zay4kvg5r6ouqzbqz4",
            "bafkreidehltzj2xxfy5l4nobqeceysdw2hynclmonfszfpy5ipcfxzdzfi"
        ],
        [50, 100, 200, 300, 400], // HP values
        [120, 100, 50, 25, 15], // Attack damage values
        "Darth Vader",
        "bafkreiermk45pbdritb3yy2l7n4veqatfcp3v4jmut56mc3ezs5nh6v5gu",
        10000,
        50
    );
    await gameContract.deployed();
    console.log("Contrato implantado no endereço:", gameContract.address);

    let txn;

    //txn = await gameContract.mintCharacterNFT(4);
    //await txn.wait();
    //console.log("Minted NFT #5");

    //console.log("Fim do deploy e mint!");


 

    txn = await gameContract.mintCharacterNFT(1);
    await txn.wait();

    let returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);

    txn = await gameContract.attackBoss();
    await txn.wait();

    //txn = await gameContract.attackBoss();
    //await txn.wait();

    returnedTokenUri = await gameContract.tokenURI(1);
    console.log("Token URI:", returnedTokenUri);

};

const runMain = async () => {
    try {
        await main();
        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
};

runMain();