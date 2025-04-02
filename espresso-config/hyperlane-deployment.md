# Rollup 1

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0x4A5a06A4f0A70FF95F1b87e92FFe4E95878c2C04` |
| staticMessageIdMultisigIsmFactory          | `0x55f91F97d40244D2CfD649a1C887b9723B99913F` |
| staticAggregationIsmFactory                | `0x81BB2ffCBE70096D1Da8aC504eAB92DF030F4b5F` |
| staticAggregationHookFactory               | `0x40f721a93CBd085d0507bc9D737ae9F46b424199` |
| domainRoutingIsmFactory                    | `0x77C99719bb3F86E7eA7e6Eb141eaBc50933A2662` |
| staticMerkleRootWeightedMultisigIsmFactory | `0xd15223159b2226a4A0e6c358b9c89dAED0b6d63b` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xd2687b8218e0FC0495922e47b7FD76e104A833Fa` |
| proxyAdmin                                 | `0xE3b06240Eff0212905961eCfE2E8E105149634AD` |
| mailbox                                    | `0xDEca226751D08dd54fBF8b483BD8274421350CfF` |
| interchainAccountRouter                    | `0x7Dbe1F8cc6b030002DfE9f408c99dcABc98188Ba` |
| interchainAccountIsm                       | `0xA49BDD6db1b1215552211f2A0bC5C62024fe7998` |
| validatorAnnounce                          | `0x8aAC76746a61A8B3744f69970797395e997ae83c` |
| testRecipient                              | `0xCC22Ef9AB522a7f5f597e0407dD8834599B1a8E7` |
| merkleTreeHook                             | `0x262b311F33fF40B2c73C742c41F891f12ddA8958` |

# Rollup 2

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0xA96d10c71295Eb5f2BA918539b4ee22ACb9D894c` |
| staticMessageIdMultisigIsmFactory          | `0x3bc26A7378Ae7CAa2e21f7D556368c871Af970F6` |
| staticAggregationIsmFactory                | `0x39f223905768c19742036b3C6a6Dbf779953927E` |
| staticAggregationHookFactory               | `0xAF11839F66c0D522Faf39d6F3eE7A044c7BEDDe7` |
| domainRoutingIsmFactory                    | `0x737AAb795754881D0f5AB298cC68DA2daAA55aC7` |
| staticMerkleRootWeightedMultisigIsmFactory | `0x251B3F6bC2d0a3F4CC1853Df3e4A0f030E392698` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xd8734181490E512717406b4842Fb7AdD701d5713` |
| proxyAdmin                                 | `0x2B0Ce96FA6B4213664Ee740435AA7Ec0FC0bd4e5` |
| mailbox                                    | `0x191AFEFF5201f1Bc7d982CA7477Be5d14F055544` |
| interchainAccountRouter                    | `0xdA3d1ecE6c0348FC4a5Ee15881E2F95Ee8a5DA55` |
| interchainAccountIsm                       | `0x4bDF5CCCe92291a2c2CEe8c506874759221f5fCA` |
| validatorAnnounce                          | `0x4A5a06A4f0A70FF95F1b87e92FFe4E95878c2C04` |
| testRecipient                              | `0x55f91F97d40244D2CfD649a1C887b9723B99913F` |
| merkleTreeHook                             | `0x0535D6FE2118E358B527211B26E78374DcFF50f0` |

# Arbitrum Sepolia

| Component                                  | Address                                      |
| ------------------------------------------ | -------------------------------------------- |
| staticMerkleRootMultisigIsmFactory         | `0x51f31d103571d40807110aD1B21fd76CEdB7A073` |
| staticMessageIdMultisigIsmFactory          | `0x0B408cccb2c32FeAE1ba669803BeB1E07AA19CA1` |
| staticAggregationIsmFactory                | `0xB0fD78e57d73E02ad456002A5990A62a41040eb7` |
| staticAggregationHookFactory               | `0x86e5c56df22b9de05200b3D30918771CB492B179` |
| domainRoutingIsmFactory                    | `0xE3a9D9Beac0E5ecfb8f99c6be60632d9Fb8846Eb` |
| staticMerkleRootWeightedMultisigIsmFactory | `0xd89FFbD23FF6e56DA88b57ca9a9ceC36B343B4dc` |
| staticMessageIdWeightedMultisigIsmFactory  | `0xe85Da70c1bcfc5866DEb1b169FCC7319Bc0c1065` |
| proxyAdmin                                 | `0x011D28B159C2D16338fec949ED14e09AdeaC6D2D` |
| mailbox                                    | `0xB733CafEDe04238AA10773Fd701cE021170dDa7E` |
| interchainAccountRouter                    | `0x9b8D106643152978e8cE387f206FA2b29987C771` |
| interchainAccountIsm                       | `0xfF46B6B9db593F3F8DfEaa78580B0CA452aaC533` |
| validatorAnnounce                          | `0xD515514B4bC452f32720D678A71706147D5f383B` |
| testRecipient                              | `0x512AB2936Ec466b67C120c1e5f2B937b2c1Db16d` |
| merkleTreeHook                             | `0x357Bc7F695f2E9E7681c49855884c5E28B5e7059` |

# core-config.yaml

```yaml
defaultHook:
  type: merkleTreeHook
defaultIsm:
  relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: trustedRelayerIsm
owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
proxyAdmin:
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
requiredHook:
  beneficiary: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  maxProtocolFee: "100000000000000000"
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  protocolFee: "0"
  type: protocolFee
```

# warp-route-deployment.yaml

```yaml
arbitrumsepolia:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0x011D28B159C2D16338fec949ED14e09AdeaC6D2D"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
rollup1:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0xE3b06240Eff0212905961eCfE2E8E105149634AD"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
rollup2:
  interchainSecurityModule:
    modules:
      - relayer: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: trustedRelayerIsm
      - domains: {}
        owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
        type: defaultFallbackRoutingIsm
    threshold: 1
    type: staticAggregationIsm
  isNft: false
  owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  proxyAdmin:
    address: "0x2B0Ce96FA6B4213664Ee740435AA7Ec0FC0bd4e5"
    owner: "0x16ab338D1D018df66D55d0cAaE5abe4034ca0A9A"
  type: native
```
